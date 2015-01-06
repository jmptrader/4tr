# Author
{% if (author && author.name && author.url) { 
%}+ [{%= author.name %}]({%= author.url %}){% 
} else if (author && author.name) { 
%}+ {%= author.name %}{% 
} else if (author) { 
%}+ {%= author %}{% 
} %}

# Contributors
{% _.each(contributors, function(contributor) { 
  if (contributor && contributor.name && contributor.url) { 
%}+ [{%= contributor.name %}]({%= contributor.url %}) {% 
  } else if (contributor && contributor.name) { 
%}+ {%= contributor.name %}{% 
  } else if (contributor) { 
%}+ {%= contributor %}{% 
  } 
});%}
