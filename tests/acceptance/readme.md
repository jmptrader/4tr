# Acceptance Tests

Acceptance testing is a _validation_ activity; did we build the right thing? Is this what the customer really needs?

Standard acceptance testing involves performing tests on the full system (e.g. using your web page via a web browser) to see whether the application's functionality satisfies the specification. E.g. "clicking a zoom icon should enlarge the document view by 25%." There is no real continuum of results, just a pass or fail outcome.

The advantage is that the tests are described in plain English and ensures the software, as a whole, is feature complete. The disadvantage is that you've moved another level up the testing pyramid. Acceptance tests touch mountains of code, so tracking down a failure can be tricky.

Also, in agile software development, user acceptance testing involves creating tests to mirror the user stories created by/for the software's customer during development. If the tests pass, it means the software should meet the customer's requirements and the stories can be considered complete. An acceptance test suite is basically an executable specification written in a domain specific language that describes the tests in the language used by the users of the system.

These tests must be conducted in a "production-like" environment, on hardware that is the same as, or close to, what a customer will use. This is when we test our "foo-ilities":

*Reliability, Availability*: Validated via a stress test.

*Scalabilitiy*: Validated via a load test.

*Usability*: Validated via an inspection and demonstration to the customer. Is the UI configured to their liking? Did we put the customer branding in all the right places? Do we have all the fields/screens they asked for?

*Security*: Validated via demonstration. Sometimes a customer will hire an outside firm to do a security audit and/or intrusion testing.

*Maintainability*: Validated via demonstration of how we will deliver software updates/patches.

*Configurability*: Validated via demonstration of how the customer can modify the system to suit their needs.

*Compatibility*: Validated via demonstration that the system will work with 3rd party systems

*Transferability*: Validated via demonstration that the system can opperate in different contexts in a decoupled manner