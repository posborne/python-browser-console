import collections
import code
import sys
import StringIO


class WebConsoleInterpreter(object):

    def __init__(self, output_history=1000, command_history=100):
        self._output_idx = 0
        self._output = collections.deque(maxlen=output_history)
        self._history = collections.deque(maxlen=command_history)
        self.interpreter = code.InteractiveConsole(globals())

    def _get_idx(self):
        idx = self._output_idx
        self._output_idx += 1
        return idx

    def get_history(self):
        return list(self._history)

    def get_output_lines(self, since_idx=0):
        for record in list(self._output):
            if record["idx"] >= since_idx:
                yield record

    def get_output(self, since_idx=0):
        sio = StringIO.StringIO()
        for record in self.get_output_lines(since_idx):
            if record["type"] == "input":
                sio.write(">>> {}\n".format(record["line"]))
            else:
                sio.write("{}\n".format(record["line"]))
        return sio.getvalue()

    def push(self, line):
        output = StringIO.StringIO()
        orig_stdout = sys.stdout
        orig_stderr = sys.stderr
        sys.stdout = sys.stderr = output
        self.interpreter.push(line)
        sys.stdout = orig_stdout
        sys.stderr = orig_stderr

        # record the results
        self._history.append(line)
        self._output.append({
            "type": "input",
            "idx": self._get_idx(),
            "line": line
        })

        output.seek(0)  # move back to beginning of buffer
        for line in output.read().split('\n'):
            idx = self._output_idx
            self._output_idx += 1
            self._output.append({
                "type": "output",
                "idx": self._get_idx(),
                "line": line.strip("\r\n"),
            })

if __name__ == "__main__":
    console = WebConsoleInterpreter()
    console.push("print 'hello'")
    console.push("print 'world'")
    print console.get_output()
