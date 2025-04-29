from app import db

class Question(db.Model):
    __tablename__ = 'questions'
    id            = db.Column(db.Integer, primary_key=True)
    subject       = db.Column(db.String, nullable=False)
    grade         = db.Column(db.Integer, nullable=False)
    question_text = db.Column(db.Text,    nullable=False)
    option_a      = db.Column(db.String,  nullable=False)
    option_b      = db.Column(db.String,  nullable=False)
    option_c      = db.Column(db.String,  nullable=False)
    option_d      = db.Column(db.String,  nullable=False)
    answer        = db.Column(db.String(1), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question_text,
            'options': {
                'A': self.option_a,
                'B': self.option_b,
                'C': self.option_c,
                'D': self.option_d,
            },
            'answer': self.answer
        }