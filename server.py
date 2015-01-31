import flask
import json
import cgi
import webconsole

app = flask.Flask(__name__)

console = webconsole.WebConsoleInterpreter()

@app.route("/api/console", methods=['POST', ])
def post_to_console():
    inp = flask.request.form.get('input', None)
    if inp is not None:
        console.push(inp)

    return json.dumps({
        "outputRecords": list(console.get_output_lines()),
        "history": console.get_history(),
    })


if __name__ == "__main__":
    app.run(debug=True)
