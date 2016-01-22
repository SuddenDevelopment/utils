# utils

I found some of these on stack overflow, some of them in other open source libraries and had to develop some myself because I couldn't find them eslewhere. Some of the common functions are there just to be fast and sometimes quirky implementations for example: forEach will destroy the array it's passed because it does it through pop()

for browsers
======
<pre>
bower install suddenutils --save
</pre>

for node
======
<pre>
npm install suddenutils
</pre>

h2. notable functions
- deepkeys : recursively look for all properties in an object until you hit an array, creats string paths 'firstpath.childpath'
- defaults : define a defaults object, and an object with some values, get back the defaults with overrides
