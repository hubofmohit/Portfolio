# app.py
import os
from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Mail config
app.config['MAIL_SERVER']         = 'smtp.gmail.com'
app.config['MAIL_PORT']           = 587
app.config['MAIL_USE_TLS']        = True
app.config['MAIL_USERNAME']       = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD']       = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')

mail = Mail(app)
RECIPIENT_EMAIL = os.environ.get('MAIL_USERNAME')  # emails land in your own inbox

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.get_json()

    name    = data.get('name', '').strip()
    email   = data.get('email', '').strip()
    message = data.get('message', '').strip()

    if not all([name, email, message]):
        return jsonify({'error': 'All fields are required.'}), 400

    try:
        msg = Message(
            subject=f'Portfolio Inquiry from {name}',
            recipients=[RECIPIENT_EMAIL],
            reply_to=email,
            body=f"""
New inquiry from your portfolio:

Name:    {name}
Email:   {email}

Message:
{message}
"""
        )
        mail.send(msg)
        return jsonify({'success': True}), 200

    except Exception as e:
        print(f'Mail error: {e}')
        return jsonify({'error': 'Failed to send email. Please try again later.'}), 500

if __name__ == '__main__':
    app.run(debug=True)