from flask import Blueprint, render_template, jsonify, request
from .model import Question
from . import db
from sqlalchemy.sql import func

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template('index.html')

@main.route('/nvo/<int:grade>')
def test_page(grade):
    return render_template('test.html', grade=grade)

@main.route('/api/test/<int:grade>/<string:subject>/<int:n>')
def get_test(grade, subject, n):
    # Validate the subject and grade
    if subject.upper() != 'BEL' or grade != 12:
        return jsonify({"error": "Наличен е само предметът БЕЛ за 12 клас."}), 400

    # Fetch random questions from the database
    questions = (Question.query
                 .filter_by(subject=subject.upper(), grade=grade)
                 .order_by(func.random())
                 .limit(n)
                 .all())

    # Return the questions as JSON
    if not questions:
        return jsonify({"error": "Няма налични въпроси за избраните критерии."}), 404

    return jsonify([q.to_dict() for q in questions])

@main.route('/nvo/<int:grade>/<string:subject>/<int:year>')
def official_test_placeholder(grade, subject, year):
    return jsonify({
        "message": f"This will show the official NVO test for {subject.upper()} in {year} (grade {grade}) — coming soon!"
    })

@main.route('/subjects')
def subjects_page():
    return render_template('subjects.html')

@main.route('/contact')
def contact_page():
    return render_template('contact.html')
