import flask
import json
import cgi
import webconsole

app = flask.Flask(__name__)
console = webconsole.WebConsoleInterpreter()


def _get_console_state_json():
    return json.dumps({
        "outputRecords": list(console.get_output_lines()),
        "history": console.get_history(),
    })


@app.route("/")
def index():
    return flask.render_template("index.html")


@app.route("/api/console", methods=['GET', 'POST'])
def post_to_console():
    inp = flask.request.form.get('input', None)
    if inp is not None:
        console.push(inp)

    return _get_console_state_json()

if __name__ == "__main__":
    app.run(debug=True)
