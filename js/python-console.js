var $ = require('jquery-browserify');
var React = require('react');

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
      <PythonConsoleOutput outputRecords={this.state.outputRecords} />
      <PythonConsoleInput submitInput={this.submitInput} />
      </div>
    );
  }
});

var PythonConsoleOutput = React.createClass({
  render: function() {
    var output = [];
    for (var i = 0; i < this.props.outputRecords.length; i++) {
      var record = this.props.outputRecords[i];
      console.log(record.line);
      if (record.type == "input") {
        output.push(<span>&gt;&gt;&gt; {record.line}</span>);
      } else if (record.type == "output") {
        output.push(<div>{record.line}</div>);
      }
    }

    var codeStyle = {
      "white-space": "pre-wrap",
      "font-family": "monospace"
    };

    return (
      <div style={codeStyle}>{output}</div>
    );
  }
});

var PythonConsoleInput = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var input = this.refs.input.getDOMNode().value;
    this.props.submitInput(input);
    this.refs.input.getDOMNode().value = '';
  },
  render: function() {
    var inputBoxStyle = {
      "font-family": "monospace",
      
    };
    return (
      <form className="pythonConsoleInputForm" onSubmit={this.handleSubmit}>
      <input type="text" placeholder="... python code ..." ref="input" />
      <input type="submit" value="Post" />
      </form>
    );
  }
});

/* Render the python console to the page */
$(document).ready(function() {
  React.render(
    <PythonConsole />,
    document.getElementById('content')
  );
});
