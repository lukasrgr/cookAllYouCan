trimArguments
=============

Function that resolves a functions's arguments into a standard javascript Array, and removes any trailing undefined arguments so that the length of the array is more predictably meaningful.

Usage
=====
```
function example() { 
  var args = trimArguments(arguments)
  console.log((args instanceof Array)+" "+args.length)
}

example(1,2,3,undefined,undefined) // prints 'true 3'
```

Install
=======

```
npm install git+https://git@github.com/fresheneesz/trimArguments.git
```

How to Contribute!
============

Anything helps:

* Creating issues (aka tickets/bugs/etc). Please feel free to use issues to report bugs, request features, and discuss changes
* Updating the documentation: ie this readme file. Be bold! Help create amazing documentation!
* Submitting pull requests.

How to submit pull requests:

1. Please create an issue and get my input before spending too much time creating a feature. Work with me to ensure your feature or addition is optimal and fits with the purpose of the project.
2. Fork the repository
3. clone your forked repo onto your machine and run `npm install` at its root
4. If you're gonna work on multiple separate things, its best to create a separate branch for each of them
5. edit!
6. If it's a code change, please add to the unit tests (at test/trimArgumentsTest.js) to verify that your change
7. When you're done, run the unit tests and ensure they all pass
8. Commit and push your changes
9. Submit a pull request: https://help.github.com/articles/creating-a-pull-request

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT