<?php
  session_start();
  session_unset();
  srand();
  $challenge = "";
  for ($i = 0; $i < 80; $i++) {
    $challenge .= dechex(rand(0, 15));
  }
  $_SESSION[challenge] = $challenge;
?>
<html>
  <head>
     <title>Login</title>
     <link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all.css" />
     <script type="text/javascript" src="extjs/ext-all.js"></script>
     <script type="text/javascript" src="md5.js"></script>
     <script type="text/javascript">
       Ext.onReady(function(){
         var loginForm = new Ext.form.FormPanel({
			frame: true,
			border: false,
			labelWidth: 75,
			items: [{
             xtype: 'textfield',
             width: 190,
             name: 'user',
             id: 'username',
             fieldLabel: 'User name'
           },{
             xtype: 'textfield',
             width: 190,
             id: 'password',
             fieldLabel: 'Password',
             inputType: 'password',
             submitValue: false,
			listeners: {
				specialkey: function(field, e){
					if (e.getKey() == e.ENTER) {
						Ext.getCmp("submit").btnEl.dom.click();
					}
				}
			},
           },{
             xtype: 'hidden',
             id: 'challenge',
             value: "<?php echo $challenge; ?>",
             submitValue: false
           }],
           buttons: [{
             text: 'Login',
             id: 'submit',
             handler: function(){
               if(Ext.getCmp('username').getValue() !== '' && Ext.getCmp('password').getValue() !== ''){
                 loginForm.getForm().submit({
                   url: 'bcknd/authenticate.php',
                   method: 'POST',
                   params: {
                     response: hex_md5(Ext.getCmp('challenge').getValue()+Ext.getCmp('password').getValue()),
					 username: Ext.getCmp('username').getValue(),
                   },
                   success: function(){
                     window.location = 'index2.html';
                   },
                   failure: function(form, action){
                     Ext.MessageBox.show({
                       title: 'Error',
                       msg: action.result.message,
                       buttons: Ext.Msg.OK,
                       icon: Ext.MessageBox.ERROR
                     });
                   }
                 });
               }else{
                 Ext.MessageBox.show({
                   title: 'Error',
                   msg: 'Please enter user name and password',
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.ERROR
                 });
               }
             }
           }]
         });
         var loginWindow = new Ext.Window({
           title: 'Login',
           layout: 'fit',
           closable: false,
           resizable: false,
           draggable: false,
           border: false,
           height: 125,
           width: 300,
           items: [loginForm]
         });
         if (Ext.isIE) {
             Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'Currently Internet Explorer is unsupported',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
               });
         } else {
             loginWindow.show();
             Ext.getCmp("username").focus('', 10);
         }
       });
     </script>
   </head>
   <body>
   </body>
</html>
