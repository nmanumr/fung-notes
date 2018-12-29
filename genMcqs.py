#!/usr/bin/env python

import os
import re

crnt_path = os.path.dirname(os.path.abspath(__file__))
docs_path = os.path.join(crnt_path, 'docs')
MCQ_RE = re.compile(r"[*]\s*\[((\s*)|[x])\]\s*(.*)")
header_RE = re.compile(r"^\s*(\w+):\s*([\w ]*)")
q_num=1

def process_file(file):
    outfile = open(file.replace('.txt', '.md'), 'w+')
    text = open(file).read()
    blocks = text.split("\n\n\n")
    new_text_f = '%s\n\n<link rel="stylesheet" href="../../css/ex.css">\n\n# %s\n<ol class="questions">'
    new_text =""

    meta = process_meta(blocks[0])
    if bool(meta):
        new_text = new_text_f % (blocks[0], meta['heading'] if meta['heading'] else "");
        blocks= blocks[1:]

    for block in blocks:
        new_text+=process_block(block)

    new_text += '</ol><script src="../../js/mcqs.js"></script>'
    outfile.write(new_text)


def process_meta(block):
    lines = block.split('\n')
    headers = {}
    for ln in lines:
        m = header_RE.match(ln)
        if (m):
            headers[m.group(1)]= m.group(2)

    return headers



def process_block(block):
    question={
        "text": "",
        "options": []
    }
    text=[];
    for ln in block.split('\n'):
        m = MCQ_RE.match(ln)
        if(m):
            question['options'].append({
                "text": m.group(3),
                "isCorrect": m.group(1)=="x"
            })
        else:
            text.append(re.sub(r"^[\d]+[.] ", "", ln))
    question['text'] = "\n".join(text) + "\n"
    return process_question(question)


def process_question(question):
    global q_num
    q_html = '<li id="q-{0}"><p class="q-text" markdown="1">{1}</p><div>{2}</div><div class="ans hidden">Ans: {3}</div></li>'
    op_html = '<div class="md-radio {3}"><input id="{0}-{1}" type="radio" name="{0}"><label for="{0}-{1}">{2}</label></div>'
    opts_html =""
    correct = None
    for i, op in enumerate(question['options']):
        opts_html += op_html.format(q_num, i, op['text'], "correct" if op['isCorrect'] else "")
        if op['isCorrect']:
            correct= op['text']
    text = q_html.format(q_num, question['text'], opts_html, correct)
    q_num += 1
    return text


for dir in os.listdir(docs_path):
    if dir.endswith('.md'):
        continue
    for file in os.listdir(os.path.join(docs_path, dir)):
        if file.endswith('ex.txt'):
            filepath = os.path.join(docs_path, dir, file)
            q_num = 1
            process_file(filepath)
