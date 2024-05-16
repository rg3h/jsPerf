<img valign="top" width="64" src="./src/assets/images/logo/logo256.png"/> <img valign="top" src="./src/assets/images/logo/logoText.png" alt="jsPerf"/><br>
<b>a simple-to-use JavaScript timer and memory module</b>
<br>

jsPerf is a simple-to-use JavaScript module that measures memory and speed.
It works both in node and on the web and comes with several examples. 
jsPerf also includes a real-time memory widget so you can observe overall memory behavior.
<br>

<table>
  <tr>
    <td valign="top">
      <b>Example Memory Example Results</b>
      <br>
<pre>baseline memory used:............ 4,737,080
memory after creating 10M array: 84,732,544
memory after removing 10M array:  4,732,400</pre>
      <br>
      <b>jsPerf Memory Widget Example</b><br>
      <img width="250" src="./src/assets/images/screenshots/jsPerfWidgetAnim.gif" alt="animated jsPerf widget" />
      <br><br>
      <a href="./src/modules/jsPerfWidget/examples/jsPerfWidgetExample.html">memory widget demo</a>
    </td>
    <td valign="top">
      <b>jsPerf Timer Example Results</b>
      <br>
      <pre>time to run a 100,000,000 for loop: 0.094s<br><br><br></pre>
      <br>
      <b>Time Your Code Tool</b><br>
      <img width="250" src="./src/assets/images/screenshots/timeYourCode.jpg" alt="time your code tool" />
      <br><br>
      <a href="./src/modules/jsPerf/examples/webExamples/timeYourCode/timeYourCode.html">time your code tool</a>
      <br><br>
    </td>
  </tr>
</table>
<br>
<b>jsPerf API</b>
<table>
  <tr><td>getName()</td><td>returns the module's name (jsPerf)</td></tr>
  <tr><td>getVersion()</td><td>returns the module's version</td></tr>
  <tr><td>supportsMemory()</td><td>returns true if memory functions are available</td></tr>
  <tr><td>gcIsAvailable()</td><td>returns true if jsPerf can call the garbage collector</td></tr>
  <tr><td>startTime()</td><td>start the timer, returning start time</td></tr>
  <tr><td>getTime(startTime)</td><td>get the performance time in seconds</td></tr>
  <tr><td>async getMemory()</td><td>get the heap memory used</td></tr>
</table>
<br>


<a href="https://rg3h.github.io/jsPerf/"><b>learn more and see more examples</b></a>
