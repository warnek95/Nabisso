angular.module('TchatModule', ['react']);
angular.module('TchatModule')
.controller('TchatController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {
	$scope.addMemberForm = function () {
		$scope.group.push($scope.member.pseudo);
		$scope.member.pseudo='';
	}
	$scope.$watch("room", function(){
        var Comment = React.createClass({displayName: "Comment",
		  render: function() {
		    return (
		      React.createElement("div", {className: "comment"}, 
		          this.props.author, " : ", this.props.children
		      )
		    );
		  }
		});

		var CommentForm = React.createClass({displayName: "CommentForm",
		  handleSubmit: function(e) {
		    e.preventDefault();
		    var text = React.findDOMNode(this.refs.text).value.trim();
		    var room = React.findDOMNode(this.refs.room).value.trim();
		    if (!text || !room ) {
		      return;
		    }
		    this.props.onCommentSubmit({room: room, text: text, group: $scope.group});
		    React.findDOMNode(this.refs.text).value = '';
		    React.findDOMNode(this.refs.room).value = '';
		    return;
		  },
		  render: function() {
		    return (
			    	React.createElement("div", null, 
						React.createElement("div", {className: "barre2"}), 

				   		React.createElement("div", {className: "answer"}, 
					      React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
					        React.createElement("input", {type: "hidden", ref: "room", value: $scope.room}), 
					        React.createElement("input", {type: "text", className: "form-control input", placeholder: "Envoyer un message ...", ref: "text"}), 
					        React.createElement("input", {type: "submit", className: "btn btn-primary btn-sm buttonchat", value: "Discussion Instantanée"}), 
					        React.createElement("div", {className: "logos"}, 
          						React.createElement("a", {href: "#", id: "popover"}, React.createElement("span", {className: " glyphicon glyphicon-align-left"}), " "), 
					            React.createElement("div", {id: "popover-head", className: "hide"}, 
					              "Ajouter un membre"
					            ), 
            					React.createElement("div", {id: "popover-content", className: "hide"}, 
              						React.createElement("input", {type: "text"}), 
                					React.createElement("button", {type: "button", className: "btn btn-danger"}, "Ajouter")
								), 
          					React.createElement("span", {className: " glyphicon glyphicon-asterisk"})
          					)
					      )
				      	)
				     )
		    )
		  }
		});

		var CommentBox = React.createClass({displayName: "CommentBox",
		  loadCommentsFromServer: function() {
		    $.ajax({
		      url: "/tchat/get",
		      dataType: 'json',
		      type: 'POST',
  			  data: {room: $scope.room},
		      success: function(data) {
		        this.setState({data: data});
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error("/tchat/get", status, err.toString());
		      }.bind(this)
		    });
		  },
		  handleCommentSubmit: function(comment) {
		    $.ajax({
		      url: "/tchat/new",
		      dataType: 'json',
		      type: 'POST',
		      data: comment,
		      success: function(data) {
		        this.setState({data: data});
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error("/tchat/new", status, err.toString());
		      }.bind(this)
		    });
		  },
		  getInitialState: function() {
		    return {data: []};
		  },
		  componentDidMount: function() {
		    this.loadCommentsFromServer();
		    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
		  },
		  render: function() {
		    return (
		      React.createElement("div", {className: "commentBox"}, 
		        // React.createElement("h1", null, "Bienvenue dans le chat..."), 
		        React.createElement(CommentList, {data: this.state.data}), 
		        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
		      )
		    );
		  }
		});

		var CommentList = React.createClass({displayName: "CommentList",
		  render: function() {
		    var commentNodes = this.props.data.map(function (comment) {
		      return (
		        React.createElement(Comment, {author: comment.author}, 
		          comment.text
		        )
		      );
		    });

		    return (
		      React.createElement("div", {className: "chatroom"}, 
		         commentNodes
		      )
		    );
		  }
		});

		React.render(
		  React.createElement(CommentBox, {pollInterval: 2000}),
		  document.getElementById('example')
		);

    });
}]);

// angular.module('TchatModule', ['react']);
// angular.module('TchatModule')
// .controller('TchatController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {
// 	$scope.$watch("room", function(){
//         console.log($scope.room);
//         var Comment = React.createClass({displayName: "Comment",
// 		  render: function() {
// 		    return (
// 		      React.createElement("div", {className: "comment"}, 
// 		          this.props.author, " : ", this.props.children
// 		      )
// 		    );
// 		  }
// 		});

// 		var CommentForm = React.createClass({displayName: "CommentForm",
// 		  handleSubmit: function(e) {
// 		    e.preventDefault();
// 		    var text = React.findDOMNode(this.refs.text).value.trim();
// 		    var room = React.findDOMNode(this.refs.room).value.trim();
// 		    if (!text || !room ) {
// 		      return;
// 		    }
// 		    this.props.onCommentSubmit({room: room, text: text});
// 		    React.findDOMNode(this.refs.text).value = '';
// 		    React.findDOMNode(this.refs.room).value = '';
// 		    return;
// 		  },
// 		  render: function() {
// 		    return (
// 			    	React.createElement("div", null, 
// 						React.createElement("div", {className: "barre2"}), 

// 				   		React.createElement("div", {className: "answer"}, 
// 					      React.createElement("form", {classNameName: "commentForm", onSubmit: this.handleSubmit}, 
// 					        React.createElement("input", {type: "hidden", ref: "room", value: $scope.room}), 
// 					        React.createElement("input", {type: "text", className: "form-control input", placeholder: "Envoyer un message ...", ref: "text"}), 
// 					        React.createElement("input", {type: "submit", className: "btn btn-primary btn-sm buttonchat", value: "Discussion Instantanée"}), 
// 					        React.createElement("span", {className: " glyphicon glyphicon-align-left"}), 
// 							React.createElement("span", {className: " glyphicon glyphicon-asterisk"})
// 					      )
// 				      	)
// 				     )
// 		    )
// 		  }
// 		});

// 		var CommentBox = React.createClass({displayName: "CommentBox",
// 		  loadCommentsFromServer: function() {
// 		    $.ajax({
// 		      url: "/tchat/get",
// 		      dataType: 'json',
// 		      type: 'POST',
//   			  data: {room: $scope.room},
// 		      success: function(data) {
// 		        this.setState({data: data});
// 		      }.bind(this),
// 		      error: function(xhr, status, err) {
// 		        console.error("/tchat/get", status, err.toString());
// 		      }.bind(this)
// 		    });
// 		  },
// 		  handleCommentSubmit: function(comment) {
// 		    $.ajax({
// 		      url: "/tchat/new",
// 		      dataType: 'json',
// 		      type: 'POST',
// 		      data: comment,
// 		      success: function(data) {
// 		        this.setState({data: data});
// 		      }.bind(this),
// 		      error: function(xhr, status, err) {
// 		        console.error("/tchat/new", status, err.toString());
// 		      }.bind(this)
// 		    });
// 		  },
// 		  getInitialState: function() {
// 		    return {data: []};
// 		  },
// 		  componentDidMount: function() {
// 		    this.loadCommentsFromServer();
// 		    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
// 		  },
// 		  render: function() {
// 		    return (
// 		      React.createElement("div", {className: "commentBox"}, 
// 		        // React.createElement("h1", null, "Bienvenue dans le chat..."), 
// 		        React.createElement(CommentList, {data: this.state.data}), 
// 		        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
// 		      )
// 		    );
// 		  }
// 		});

// 		var CommentList = React.createClass({displayName: "CommentList",
// 		  render: function() {
// 		    var commentNodes = this.props.data.map(function (comment) {
// 		      return (
// 		        React.createElement(Comment, {author: comment.author}, 
// 		          comment.text
// 		        )
// 		      );
// 		    });

// 		    return (
// 		      React.createElement("div", {className: "chatroom"}, 
// 		         commentNodes
// 		      )
// 		    );
// 		  }
// 		});

// 		React.render(
// 		  React.createElement(CommentBox, {pollInterval: 2000}),
// 		  document.getElementById('example')
// 		);

//     });
// }]);