# Functional Tests

This is a _verification_ activity; did we build a correctly working product? Does the software meet the business requirements?

Functional tests check a particular feature for correctness by comparing the results for a given input against the specification. Functional tests don't concern themselves with intermediate results or side-effects, just the result (they don't care that after doing x, object y has state z). They are written to test part of the specification such as, "calling function Square(x) with the argument of 2 returns 4".