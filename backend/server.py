# libraries
from flask import Flask, request,  jsonify, json
from flask_cors import CORS
import uuid
from firebase_admin import initialize_app, credentials, storage, firestore
from werkzeug.utils import secure_filename
from datetime import datetime

# helper functions from utils module
from utils.video_utils import allowed_file

# database credentials for both video and file storage
cred = credentials.Certificate('./privatekey.json')
initialize_app(cred, {'storageBucket': 'surgeon-users.appspot.com'})
db = firestore.client()

# start flask app
app = Flask(__name__)
CORS(app)

# CREATE PROCEDURE
@app.route('/procedure', methods=['POST'])
def create_procedure():
    try:
        # extract procedure data from JSON strings
        data = request.form.to_dict()
        procedure_data = data.get('procedureData')
        json_string = procedure_data.replace("'", "\"")
        data_dict = json.loads(json_string)
        entry_data = data_dict['procedureData']
        entry_data['User'] = db.collection('users').document(data_dict['userEmail'])
        
        procedure_id = entry_data['procedureId']
        procedure_ref = db.collection('procedures').document(procedure_id)
        procedure_ref.set(entry_data)

        # upload the video
        if 'video' in request.files:
            video_file = request.files['video']

            if video_file and allowed_file(video_file.filename):
                # upload the video to firebase storage
                bucket = storage.bucket()
                filename = secure_filename(video_file.filename)
                
                blob = bucket.blob(f'videos/{filename}')
                blob.upload_from_file(video_file)

                # update the procedure data with the video link
                video_url = blob.public_url
                entry_data['video'] = video_url
                procedure_ref.update({'video': video_url})
            else:
                return jsonify({'error': 'Invalid or unsupported video file'}), 400

        return jsonify({'message': 'Procedure created successfully'}), 200
    except Exception as e:
        print('Error creating procedure:', str(e))
        return jsonify({'error': 'Internal server error'}), 500

# GET ALL PROCEDURES
@app.route('/procedures', methods=['GET'])
def get_all_procedures():
    try:
        procedures_ref = db.collection('procedures')
        procedures = procedures_ref.stream()

        # procedure data
        procedures_data = []

        # iterate through procedures and extract data
        for procedure in procedures:
            procedure_data = procedure.to_dict()
            procedure_id = procedure.id  
            procedure_data['id'] = procedure_id
            procedures_data.append(procedure_data['id'])
        
        return jsonify({'procedureIds': procedures_data}), 200
    except Exception as e:
        print('Error fetching procedures:', str(e))
        return jsonify({'error': 'Internal server error'}), 500


# GETS SPECIFIC PROCEDURE DATA
@app.route('/procedures/<procedure_id>', methods=['GET'])
def get_procedure(procedure_id):
    try:
        # get procedure data from firestore
        procedure_ref = db.collection('procedures').document(procedure_id)
        procedure_data = procedure_ref.get().to_dict()
        
        # get user info
        userinfo = (procedure_data['User']).get().to_dict()
        for i in userinfo:
            procedure_data[i] = userinfo[i]
        procedure_data['procedureId'] = procedure_id
        procedure_data.pop('User')
        
        tasks = []
        if 'tasks' in procedure_data:
            task_ids = procedure_data['tasks']
            tasks = []
            for tId in task_ids:
                taskRef = db.collection('tasks').document(tId)
                taskData = taskRef.get().to_dict()
                tasks.append({'task_id': tId, 'task_name': taskData['task_name'], 'start': taskData['start'], 'stop': taskData['stop'], 'description': taskData['description']})
            procedure_data.pop('tasks')
        

        if procedure_data:
            return jsonify({'timestamp': datetime.now().isoformat(),'statusCode':200, 'data': {'metadata': procedure_data, 'tasks': tasks}, 'message': None})
        else:
            return jsonify({'error': 'Procedure not found'}), 404
    except Exception as e:
        print('Error fetching procedure information:', str(e))
        return jsonify({'error': 'Internal server error'}), 500


# ADD TASK
@app.route('/tasks', methods=['POST'])
def add_task():
    try:
        data = request.get_json()

        # parse request
        description = data.get('description')
        name = data.get('name')
        procedure_id = data.get('procedureId')
        start = data.get('start')
        stop = data.get('stop')

        # validate required fields  present
        if not description or not procedure_id:
            return jsonify({'error': 'Description and procedure_id are required'}), 400

        # generate random uuid
        task_id = str(uuid.uuid4())

        # add task
        tasks_ref = db.collection('tasks').document(task_id)
        tasks_ref.set({
            'task_name': name,
            'description': description,
            'start': start,
            'stop': stop,
            'procedure_id': procedure_id,
            # Add other fields as needed
        })

        # update the procedure document to include a reference to the new task
        procedure_ref = db.collection('procedures').document(procedure_id)
        procedure_ref.update({
            'tasks': firestore.ArrayUnion([task_id])
        })

        return jsonify({'message': "Successfully added task"}), 200

    except Exception as e:
        print('Error adding task:', str(e))
        return jsonify({'error': 'Internal server error'}), 500



# GET USER INFO THROUGH EMAIL
@app.route('/user/<email>', methods=['GET'])
def get_user_data(email):
    try:
        doc_ref = db.collection('users').document(email)
        doc = doc_ref.get()

        if doc.exists:
            return jsonify(doc.to_dict()), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print('Error fetching user data:', str(e))
        return jsonify({'error': 'Internal server error'}), 500

# CREATE NEW USER / UPDATE CURRENT USER
@app.route('/user', methods=['POST'])
def add_or_update_user():
    try:
        # prase request
        data = request.get_json()
        email = data.get('email')
        user_data = data.get('userData')

        # add the user
        if email and user_data:
            doc_ref = db.collection('users').document(email)
            doc_ref.set(user_data)
            return jsonify({'message': 'User added successfully'}), 200
        else:
            return jsonify({'error': 'Invalid request parameters'}), 400
    except Exception as e:
        print('Error adding or updating user:', str(e))
        return jsonify({'error': 'Internal server error'}), 500


# GET PROCEDURE VIDEO
@app.route('/procedure/<procedure_id>/video', methods=['GET'])
def get_procedure_video(procedure_id):
    try:
        # load the video link
        procedure_ref = db.collection('procedures').document(procedure_id)
        procedure_data = procedure_ref.get().to_dict()
        
        if procedure_data and 'video' in procedure_data:
            return jsonify({'videoUrl': procedure_data['video']})
        else:
            return jsonify({'error': 'Video not found'}), 404
    except Exception as e:
        print('Error fetching video:', str(e))
        return jsonify({'error': 'Internal server error'}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5002)
