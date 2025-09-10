from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit-appointment', methods=['POST'])
def submit_appointment():
    try:
        # Get form data
        data = request.get_json()
        
        name = data.get('name', '')
        email = data.get('email', '')
        phone = data.get('phone', '')
        consultancy_type = data.get('consultancyType', '')
        online_date = data.get('onlineDate', '')
        online_time = data.get('onlineTime', '')
        message = data.get('message', '')
        
        # Validate required fields
        if not all([name, email, phone, consultancy_type]):
            return jsonify({'success': False, 'message': 'Please fill in all required fields.'}), 400
        
        # Create appointment details
        appointment_details = f"""
        New Appointment Request:
        
        Name: {name}
        Email: {email}
        Phone: {phone}
        Consultancy Type: {consultancy_type}
        """
        
        if consultancy_type == 'online' and online_date and online_time:
            appointment_details += f"Preferred Date & Time: {online_date} at {online_time}\n"
        
        if message:
            appointment_details += f"Message: {message}\n"
        
        appointment_details += f"Submitted on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        # For now, just log the appointment (you can add email functionality later)
        print("=" * 50)
        print("NEW APPOINTMENT REQUEST")
        print("=" * 50)
        print(appointment_details)
        print("=" * 50)
        
        # You can add email sending functionality here if needed
        # send_email_notification(appointment_details)
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your appointment request! We will contact you soon.'
        })
        
    except Exception as e:
        print(f"Error processing appointment: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'There was an error processing your request. Please try again.'
        }), 500

def send_email_notification(appointment_details):
    """
    Optional email functionality - configure with your email settings
    """
    try:
        # Email configuration (uncomment and configure if needed)
        # smtp_server = "smtp.gmail.com"
        # smtp_port = 587
        # sender_email = "your-email@gmail.com"
        # sender_password = "your-app-password"
        # recipient_email = "prajubkadam@gmail.com"
        
        # msg = MIMEMultipart()
        # msg['From'] = sender_email
        # msg['To'] = recipient_email
        # msg['Subject'] = "New Appointment Request - Vithai Child Care Clinic"
        
        # msg.attach(MIMEText(appointment_details, 'plain'))
        
        # server = smtplib.SMTP(smtp_server, smtp_port)
        # server.starttls()
        # server.login(sender_email, sender_password)
        # text = msg.as_string()
        # server.sendmail(sender_email, recipient_email, text)
        # server.quit()
        
        pass
    except Exception as e:
        print(f"Email sending failed: {str(e)}")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

