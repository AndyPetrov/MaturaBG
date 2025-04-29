import os
import json
from app import create_app, db
from app.model import Question

if not os.path.exists('multiple_choice_questions.json'):
    print("Error: 'multiple_choice_questions.json' not found.")
    exit(1)

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    with open('multiple_choice_questions.json', encoding='utf-8') as f:
        data = json.load(f)['questions']

    for item in data:
        q = Question(
            subject='BEL',
            grade=12,
            question_text=item['question'],
            option_a=item['options']['A'],
            option_b=item['options']['B'],
            option_c=item['options']['C'],
            option_d=item['options']['D'],
            answer=item['answer']
        )
        db.session.add(q)

    db.session.commit()
    print(f"Inserted {len(data)} questions into the database.")
