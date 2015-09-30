var app = app || {};

app.Lessons = Backbone.Model.extend({
	url: function(){
		return '/learn/lessons'
	},
	defaults: {
		errors: [],
		errfor: {},
		lessons: []
	}
});

app.Lesson = Backbone.Model.extend({
	url: function(){
		return '/learn/lessons' + 
			(this.id === '' ?  '' : '/' + this.id);
	},
	id: '',
	defaults: {
		errors: [],
		errfor: {},
		lesson: {}
	}
});

app.ListView = Backbone.View.extend({
	el: '#tolearnlist',
	template: _.template( $('#tmpl-tolearnlist').html() ),
	events: {
		'click #lesson': 'listLesson',
		'click .btn-add': 'add'
	},
	initialize: function(){
		this.model = new app.Lessons();
		
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model, 'change', this.render);
		this.model.fetch();
	},
	render: function(){
		this.$el.html(this.template(this.model.attributes));
	},
	listLesson: function(evt){
		var id = $(evt.target).data('id');

		app.lessonView.model.set('id', id);
		app.lessonView.model.fetch();			
	},
	add: function(evt){
		var that = app.lessonView;
		that.model = new app.Lesson();

		that.listenTo(that.model, 'sync', that.render);
		that.listenTo(that.model, 'change', that.render);
		that.model.fetch();			
	}
});

app.LessonView = Backbone.View.extend({
	el: '#lessoninfo',
	template: _.template( $('#tmpl-lessonlearn').html() ),
	events: {
		'click .btn-edit': 'edit',
		'click .btn-save': 'save',
		'click .btn-cancel': 'cancel'
	},
	initialize: function(){
		this.model = new app.Lesson();
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		this.$el.html( this.template( this.model.attributes ));
		console.log('id: ' + this.model.id);
		console.log('defaults: ' + this.model.defaults);
		if(this.model.id === '') this.edit();
	},
	edit: function(evt){
		this.$el.find('.non-editable').addClass('hide');
		this.$el.find('.editable').removeClass('hide');

		if(this.model.id === ''){
			this.$el.find('[name=name-static]').addClass('hide');
			this.$el.find('[name=lessonname]').removeClass('hide');
		} else {
			this.$el.find('[name=lessonname]').addClass('hide');
			this.$el.find('[name=name-static]').removeClass('hide');
		}
	},
	save: function(evt){
        evt.preventDefault();

        var name = this.$el.find('[name=lessonname]').val(),
        	url = this.$el.find('[name=lessonurl]').val(),
        	learn = this.$el.find('[name=lessonlearn]').val();

		console.log(name + ', ' + url + ', ' + learn);

		this.model.save({
			lessonName: name,
			lessonUrl: url,
			lessonLearn: learn
		});

	},
	cancel: function(evt){
		if(this.model.isNew()) {
			this.$el.empty();
			return this;
		}

		this.$el.find('.editable').addClass('hide');
		this.$el.find('.non-editable').removeClass('hide');
	}
});

$(document).ready(function(){
	app.listView = new app.ListView();
	app.lessonView = new app.LessonView();
});

