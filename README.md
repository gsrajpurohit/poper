# poper
Jquery based popup box

###  Get a copy of the plugin
You can download the plugin from GitHub.

###  Load the required files
Inside the page's head tag include the desired CSS file.

In the page's footer, just before, include the required JavaScript files.

###  Create the HTML markup
`<div id="poper"></div>`

### Instantiate the Plugin
```
<script type="text/javascript">
    jQuery( document ).ready(function( $ ) { 
        $( '#poper' ).poper({
            theme: 'blue',
            size: 'small',
            headerText: "Poper By HTML",
            content: "http://192.168.4.218/plugins/poper/test.html",
            remote: true
        })
    }); 
</script>
```
#### OR by data attributes
`<div  data-poper="true" data-size="big" data-theme="blue" data-header-text="Heading" data-content="data content 2<br>data content 2<br>data content 2<br>data content 2<br>data content 2"></div>`

### Demo
[Demo](https://gsrajpurohit.github.io/poper/).

### Support
If you found a bug or have a feature suggestion, please email me on rajpurohitganpat@gmail.com.
If you need help with implementing the "Poper" in your project feel free to contact me on rajpurohitganpat@gmail.com.

License The plugin is available under the [MIT license](https://opensource.org/licenses/MIT).
