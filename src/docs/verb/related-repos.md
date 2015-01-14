Here are some related projects:
{% _.each(repos, function(repo) { %} {%= n %}
### [{%= repo.name %}]({%= repo.url %}) [![NPM version](https://badge.fury.io/js/{%= repo.name %}.png)](http://badge.fury.io/js/{%= repo.name %})
> {%= repo.description %} {% }); %}