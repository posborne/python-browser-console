var $ = require('jquery-browserify');
var React = require('react');
var BSInput = require('react-bootstrap').Input;

var PythonConsole = React.createClass({
  getInitialState: function() {
    return {
      history: [],
      outputRecords: [],
    }
  },
  submitInput: function(input) {
    $.ajax({
      url: '/api/console',
      dataType: 'json',
      type: 'POST',
      data: {input: input},
      success: function(data) {
        console.log(data);
        this.setState({
          outputRecords: data.outputRecords,
          history: data.history,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/console", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
      <PythonConsoleOutput
        outputHeight={this.props.outputHeight}
        outputRecords={this.state.outputRecords} />
      <PythonConsoleInput submitInput={this.submitInput} />
      </div>
    );
  }
});

var PythonConsoleOutput = React.createClass({
  componentDidUpdate: function() {
    // on update, we need to tell the scrollbar to scroll to
    // to bottom.
    var node = this.getDOMNode();
    node.scrollTop = node.scrollHeight;
  },
  render: function() {
    var output = [];
    for (var i = 0; i < this.props.outputRecords.length; i++) {
      var record = this.props.outputRecords[i];
      console.log(record.line);
      if (record.type == "input") {
        output.push(<span style={{color: "blue", "font-weight": "bold"}}>&gt;&gt;&gt; {record.line}</span>);
      } else if (record.type == "output") {
        output.push(<div>{record.line}</div>);
      }
    }

    var codeStyle = {
      "white-space": "pre-wrap",
      "font-family": "monospace",
      "height": this.props.outputHeight,
      "overflow": "auto",
      "top": 0,
    };

    return (
      <div style={codeStyle}>{output}</div>
    );
  }
});

var PythonConsoleInput = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var inputDOMNode = this.refs.input.getInputDOMNode();
    this.props.submitInput(inputDOMNode.value);
    inputDOMNode.value = '';
  },
  render: function() {
    var inputBoxStyle = {
      "font-family": "monospace"
    };
    return (
      <form className="pythonConsoleInputForm" onSubmit={this.handleSubmit}>
        <div className="row">
        <div className="col-md-8">
          <BSInput
             type="text"
             addonBefore=">>>"
             style={inputBoxStyle}
             placeholder="... python code ..."
             ref="input" />
        </div>
        <div className="col-md-2"><BSInput type="submit" value="Post" /></div>
        </div>
      </form>
    );
  }
});

/* Render the python console to the page */
$(document).ready(function() {
    console.log("Rendering!");
  React.render(
    <PythonConsole outputHeight="80%" />,
    document.getElementById('browser-console')
  );
});
