# Benchmarking Tips

From: http://tech.opentable.co.uk/blog/2014/02/28/api-benchmark/

## Set-up Everything Correctly

* Benchmarks need to run always on the same machine, same agent, and same configuration to be reliable and comparable.
* The network should be tested to be sure there aren’t any particular limits that would affect the benchmarks. It should be tested each time before running any benchmarks and could include things like bandwidth, host name correctness, and OS limitations.
* Don’t run the tests from the same machine that hosts the application. Run it from the outside, and if you deploy in different regions, keep that in mind when you look at the results.

## Stress and Performance are Different Things

*You should test both to learn about performance but also your limits, in order to have an idea on how to scale your application or how to fix it when necessary.
* 10 seconds is not enough. 1 minute is nice, 5 is better.
One route is not enough. Testing all the routes allow us to see the difference between different response lengths.
* Sometimes your application needs a warm-up, especially if you test it after a deployment. Set up a script to do that or set a proper time-out to be sure you are retrieving some valuable numbers back.
* Don’t benchmark the live production environment. Your results are affected by too many variables. If possible, set-up a staging environment with exactly the same configuration to run benchmarks.

## Design your API to be Benchmark-able 

* Performance could depend on synchronous calls to third-party APIs or databases. Ideally routes should have an optional parameter to mock external dependencies so we should test that as well.
* Ensure that changes to data or the operating environment are not persisted after the benchmarks complete. This is important to ensure no side effects on subsequent runs and will allow you to benchmark production boxes if needed (after the deployment and obviously before directing any traffic to them).

## Tips on Analyzing Data

* Averages are not enough, peaks are important, investigate them.
* When something unexpected happens, try to reproduce it in order to fix it.
* If wildly different numbers come up every time you run the tests, your API is depending on too many unpredictable events. Try to fix it. Try to run benchmarks locally and microbenchmark your software until you find the element that is causing the unpredictability. Then, fix it or find a way to mock it if you have no other option.
* Numbers should be readable and shareable by everyone. Find a tool that dashboards your results and easily allow you to share that data.