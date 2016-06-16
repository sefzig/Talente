
'use strict'; 

   const Script = require('smooch-bot').Script; 

// Bots
   const AndreasSefzig = "[AndreasSefzig] "; 
   const EmpfangsBot = "[EmpfangsBot] "; 
   const VerkaufsBot = "[VerkaufsBot] "; 
   const MarketingBot = "[MarketingBot] "; 

// Variablen 
   var versuche_max = 3; 
   var versuche = 0; 
   var zuletzt = ""; 
   var bekannt = false;
   var botsan = true;

// Daten 
   var vorname = "Unbekannter";
   var nachname = "Besucher";
   var email = "test@chatraum.de";
   var emailkorrekt = true;
   
// Konversationen 
   module.exports = new Script({ 
   
   // ---------------
   // GESPRÄCH ANFANG
   // ---------------
     
    processing: {
        
        prompt: (bot) => bot.say(EmpfangsBot+'Nicht so schnell bitte...'),
        receive: () => 'processing'
        
    },
   
    start: {
    
    // prompt: (bot) => bot.say(EmpfangsBot+'Bitte geben Sie zunächst Ihre E-Mail-Adresse ein.'),
       receive: (bot, message) => {
            
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim());
          
       // Erster Schritt 
          var dann = "emailanfang";
          
          return bot.setProp('empfangen', 'ja')
          .then(() => bot.say(EmpfangsBot+'Ich werde Sie zunächst mit ein paar Fragen und Informationen an Bord holen.'))
          .then(() => bot.say(EmpfangsBot+'Wie lautet Ihre E-Mail-Adresse, an die wir uns wenden dürfen?'))
          .then(() => dann);
          
       }
    },

    emailanfang: {
    	
        receive: (bot, message) => {
            
            email = message.text;
            
         // emailkorrekt = email.test(emailregex);
            emailkorrekt = true;
            
            if (emailkorrekt == true) {
            	
               return bot.setProp('email', email)
                  .then(() => bot.say(EmpfangsBot+''+email+',  danke sehr. Schreiben Sie --E-Mail, falls Sie sie ändern wollen. [Javascript:cookies(email,'+email+')] '))
                  .then(() => 'ansprechpartner');
               
            }
            else {
            	
               return bot.setProp('emailversuch', 'ja')
                  .then(() => bot.say(EmpfangsBot+''+email+' ist keine valide E-Mail-Adresse. Bitte geben Sie sie nochmal ein!'))
                  .then(() => 'emailanfang');
               
            }
        }
    },

    ansprechpartner: {
    	
        prompt: (bot) => bot.say(EmpfangsBot+'Wer ist Ihr Ansprechpartner bei uns? Frau --Urbat oder Frau --Ortwerth?'),
        receive: (bot, message) => {
            
            partner = befehlWort(partner.trim());
            auswahl = auswahl.toUpperCase();
            
            if (~auswahl.indexOf("--E-MAIL")) { 
            
               return bot.setProp('emailfehleingabe', 'ja')
               .then(() => bot.say(EmpfangsBot+'Bitte geben Sie Ihre E-Mail-Adresse nochmals ein.'))
               .then(() => 'emailanfang');
               
            }
            
            else if (~auswahl.indexOf("--URBAT")) { 
            
               return bot.setProp('ansprechpartner', 'Urbat')
               .then(() => bot.say(EmpfangsBot+'Prima, Frau Urbat ist nun als Ihr Ansprechpartner gespeichert.'))
               .then(() => bot.say(EmpfangsBot+'Bitte sprechen Sie nun Talente-Bot an: --Talente.'))
               .then(() => 'empfang');
               
            }
            
            else if (~auswahl.indexOf("--ORTWERTH")) { 
            
               return bot.setProp('ansprechpartner', 'Ortwerth')
               .then(() => bot.say(EmpfangsBot+'Gut, Frau Ortwert ist als Ihr Ansprechpartner gespeichert.'))
               .then(() => bot.say(EmpfangsBot+'Bitte sprechen Sie nun Talente-Bot an: --Talente.'))
               .then(() => 'empfang');
               
            }
            
            else { 
            
               return bot.setProp('ansprechpartnerfehleingabe', 'ja')
               .then(() => bot.say(EmpfangsBot+'Das habe ich nicht verstanden.'))
               .then(() => 'ansprechpartner');
               
            }
            
        }
        
    },
   
 // -------------------------
 // Onboarding
 // -------------------------
    
    name: {
    	
        receive: (bot, message) => {
            
            var antwort = befehlWort(message.text.trim().toUpperCase());
            var dann = "name";
            
            if ((antwort == "--JA") ||
                (antwort == "--NAME") ||
                (antwort == "--ÄNDERN")) { 
               
               bot.say(EmpfangsBot+'Wir werden sorgsam mit Ihren Daten umgehen.');
               dann = "vorname";
               
            }
            if ((antwort == "--NEIN") ||
                (antwort == "--EMPFANG") ||
                (antwort == "--ABBRECHEN")) {
               
               bot.say(EmpfangsBot+'Gehen wir zurück zum --Empfang.');
               dann = "empfang";
               
            }
            if ((antwort == "--EMAIL") ||
                (antwort == "--E-MAIL")) {
               
               bot.say(EmpfangsBot+'Wir geben Ihre Adresse nicht weiter.');
               dann = "emailadresse";
               
            }
            
            return bot.setProp('name_eingabe', 'tmp')
                .then(() => dann);
        }
    },

    vorname: {
    	
        prompt: (bot) => bot.say(EmpfangsBot+'Wie heissen Sie mit Vornamen?'),
        receive: (bot, message) => {
            
            vorname = message.text;
            vorname = vorname.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
            
            return bot.setProp('vorname', vorname)
                .then(() => bot.say(EmpfangsBot+''+vorname+', prima.'))
                .then(() => bot.say(EmpfangsBot+'Und wie heissen Sie mit Nachnamen? [Javascript:cookies(vorname,'+vorname+')] '))
                .then(() => 'nachname');
        }
    },

    nachname: {
    	
        receive: (bot, message) => {
            
            nachname = message.text; 
            nachname = nachname.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
            nachname = nachname.replace("--","");
            
            bot.setProp('nachname', nachname);
            return bot.getProp('vorname')
                .then((vorname) => bot.say(EmpfangsBot+'Sie heissen also '+vorname+' '+nachname+'. Bitte geben Sie nun Ihre E-Mail-Adresse ein (sie können auch --abbrechen). [Javascript:cookies(nachname,'+nachname+')] '))
                .then(() => 'emailadresse');
            
        }
    },

    emailadresse: {
    	
        receive: (bot, message) => {
            
            email = message.text;
            
         // emailkorrekt = email.test(emailregex);
            emailkorrekt = true;
            
            if (emailkorrekt == true) {
            	
               return bot.setProp('email', email)
                  .then(() => bot.say(EmpfangsBot+''+email+' ist eine valide E-Mail-Adresse. [Javascript:cookies(email,'+email+')] '))
                  .then(() => bot.say(EmpfangsBot+'Schreiben Sie --E-Mail, um sie zu ändern. Oder lassen Sie uns zurück zum --Empfang gehen.'))
                  .then(() => 'empfang');
               
            }
            else {
            	
                return bot.say(+' 0 ').then(() => bot.say(EmpfangsBot+' Bitte geben Sie Ihre E-Mail-Adresse nochmal ein - oder lassen Sie uns zum --Empfang zurückkehren. ')).then(() => 'emailadresse');                
            }
        }
    },
   
 // ---------------------------
 // Empfang (Alice)
 // ---------------------------
 // - name_klein: empfang
 // - name_kamel: Empfang
 // - name_gross: EMPFANG
 // - frau_klein: alice
 // - frau_kamel: Alice
 // - frau_gross: ALICE
 // - bot_name:   EmpfangsBot
 // - bot_klein:  empfangsbot
 // - bot_kamel:  Empfangsbot
 // - bot_gross:  EMPFANGSBOT
 // ---------------------------
 
    empfang: {
  	
       receive: (bot, message) => {
          
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim().toUpperCase());
          
       // Nächster Schritt default
          var dann = "empfang";
          
       // Nicht-Befehl-Eingaben mitzählen
          var versuch = false;
          
       // Default-Zurück
          var zuruck = "Empfang";
          
       // Zuletzt Varianten
          var zuletzt_dann =  dann;
          var zuletzt_klein = zuletzt_dann.toLowerCase();
          var zuletzt_gross = zuletzt_dann.toUpperCase();
          var zuletzt_kamel = zuletzt_dann.charAt(0).toUpperCase() + zuletzt_dann.slice(1);
          
       // -----------------
       // Bot-Schalter
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben uns Bots ausgeschaltet. Sie können uns wieder anschalten, indem Sie --Bots-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da sind wir wieder! Schreiben Sie --Empfang, um mit mir zu sprechen - oder dem --Verkauf oder --Marketing!')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("empfang" != "empfang") {
          	 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Empfang") { 
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; }             
          } 
          else {
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'empfang');}             
          }
          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENUAN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENUAUS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENU")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENUE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Wir kennen Ihren Namen noch nicht. ').then(() => 'vorname');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Alle unsere Kontaktwege: [Text:Kontakt,RobogeddonKontakt] ').then(() => bot.say(EmpfangsBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ')).then(() => 'empfang');}          
          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'empfang');}          
       // -----------------
       // Über uns
       // -----------------
          
          if ((~befehl.indexOf("--CHATRAUM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Der Chatraum ist ein Produkt der Chatbot-Agentur #Robogeddon. ').then(() => bot.say(EmpfangsBot+' Lassen Sie uns über unsere --Produkte sprechen. Oder wollen Sie eine --Beratung? ')).then(() => 'empfang');}          
       // Produkte
          if ("empfang" != "verkauf") {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo! Mehr über unsere --Produkte folgt... ')).then(() => 'verkauf');}	       
          }
          else {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Mehr über unsere --Produkte folgt... ').then(() => 'verkauf');}	       
          }
          
       // -----------------
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--NEWSLETTER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ja, bestellen Sie unseren Newsletter! ').then(() => 'vorname');}          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Diesen Chat mobil öffnen: [Qr:http://chatraum.herokuapp.com/] ').then(() => bot.say(EmpfangsBot+' Oder öffnen Sie [Textlink:Chatraum.herokuapp.com,http://chatraum.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'empfang');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'empfang');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'empfang');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'empfang');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'empfang');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Alice. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Alice. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "verkauf") { 
             if ((~befehl.indexOf("--VERKAUF")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Barbara. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Barbara. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');} } else { 
             if ((~befehl.indexOf("--VERKAUF")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}          }
          
          if (zuletzt_klein != "marketing") { 
   		    if ((~befehl.indexOf("--MARKETING")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Cynthia. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Cynthia. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');} } else { 
   		    if ((~befehl.indexOf("--MARKETING")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}          }
          
       // Vorlage (Gewerk, Name)
          if ((~befehl.indexOf("--GEWERK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Name. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}
       // -----------------
       // System
       // -----------------
       
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Funktionen: --Kontakt, --Mobil und --Über. ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich bin der Talente-Bot. ').then(() => bot.say(EmpfangsBot+' Über den Talente-Bot. ')).then(() => 'empfang');}          
       // -----------------
       // Inhalte
       // -----------------
          
       // -----------------
       // Vorlage
       // -----------------
       
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Text Vorlage 1. ').then(() => 'empfang');}          

       // -----------------
       // Bot aus
       // -----------------
       
       // Zurück merken
          zuletzt = zuruck;
          
       // Irrläufer
          if (versuch == true) { 
             versuche = 0;
          }
          else { 
             if (botsan == true) {
                versuche++; 
                if (versuche == versuche_max)
                {
                   bot.say(EmpfangsBot+'Suchen Sie meine --Befehle? Oder schalten Sie alle --Bots-aus.'); 
                   versuche = 0;
                }
             }
          }
          
       // Weiterleiten
          return bot.setProp('empfang', 'gesprochen')
              .then(() => dann);
          
       }
        
    },
   
 // ---------------------------
 // Verkauf (Barbara)
 // ---------------------------
 // - name_klein: verkauf
 // - name_kamel: Verkauf
 // - name_gross: VERKAUF
 // - frau_klein: barbara
 // - frau_kamel: Barbara
 // - frau_gross: BARBARA
 // - bot_name:   VerkaufsBot
 // - bot_klein:  verkaufsbot
 // - bot_kamel:  Verkaufsbot
 // - bot_gross:  VERKAUFSBOT
 // ---------------------------
 
    verkauf: {
  	
       receive: (bot, message) => {
          
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim().toUpperCase());
          
       // Nächster Schritt default
          var dann = "verkauf";
          
       // Nicht-Befehl-Eingaben mitzählen
          var versuch = false;
          
       // Default-Zurück
          var zuruck = "Verkauf";
          
       // Zuletzt Varianten
          var zuletzt_dann =  dann;
          var zuletzt_klein = zuletzt_dann.toLowerCase();
          var zuletzt_gross = zuletzt_dann.toUpperCase();
          var zuletzt_kamel = zuletzt_dann.charAt(0).toUpperCase() + zuletzt_dann.slice(1);
          
       // -----------------
       // Bot-Schalter
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben uns Bots ausgeschaltet. Sie können uns wieder anschalten, indem Sie --Bots-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da sind wir wieder! Schreiben Sie --Empfang, um mit mir zu sprechen - oder dem --Verkauf oder --Marketing!')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("verkauf" != "empfang") {
          	 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Verkauf? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Verkauf? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Verkauf? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Verkauf") { 
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; }             
          } 
          else {
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'verkauf');}             
          }
          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'verkauf');}if ((~befehl.indexOf("--MENUAN")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'verkauf');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'verkauf');}if ((~befehl.indexOf("--MENUAUS")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'verkauf');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'verkauf');}if ((~befehl.indexOf("--MENU")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'verkauf');}if ((~befehl.indexOf("--MENUE")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'verkauf');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Wir kennen Ihren Namen noch nicht. ').then(() => 'vorname');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Alle unsere Kontaktwege: [Text:Kontakt,RobogeddonKontakt] ').then(() => bot.say(VerkaufsBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ')).then(() => 'verkauf');}          
          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'verkauf');}          
          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'verkauf');}          
          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'verkauf');}          
       // -----------------
       // Über uns
       // -----------------
          
          if ((~befehl.indexOf("--CHATRAUM")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Der Chatraum ist ein Produkt der Chatbot-Agentur #Robogeddon. ').then(() => bot.say(VerkaufsBot+' Lassen Sie uns über unsere --Produkte sprechen. Oder wollen Sie eine --Beratung? ')).then(() => 'verkauf');}          
       // Produkte
          if ("verkauf" != "verkauf") {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Verkauf, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo! Mehr über unsere --Produkte folgt... ')).then(() => 'verkauf');}	       
          }
          else {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Mehr über unsere --Produkte folgt... ').then(() => 'verkauf');}	       
          }
          
       // -----------------
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--NEWSLETTER")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ja, bestellen Sie unseren Newsletter! ').then(() => 'vorname');}          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Diesen Chat mobil öffnen: [Qr:http://chatraum.herokuapp.com/] ').then(() => bot.say(VerkaufsBot+' Oder öffnen Sie [Textlink:Chatraum.herokuapp.com,http://chatraum.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'verkauf');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'verkauf');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'verkauf');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'verkauf');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'verkauf');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich übergebe an Alice. Schreiben Sie --Verkauf, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich übergebe an Alice. Schreiben Sie --Verkauf, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "verkauf") { 
             if ((~befehl.indexOf("--VERKAUF")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich übergebe an Barbara. Schreiben Sie --Verkauf, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich übergebe an Barbara. Schreiben Sie --Verkauf, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');} } else { 
             if ((~befehl.indexOf("--VERKAUF")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}          }
          
          if (zuletzt_klein != "marketing") { 
   		    if ((~befehl.indexOf("--MARKETING")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich übergebe an Cynthia. Schreiben Sie --Verkauf, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich übergebe an Cynthia. Schreiben Sie --Verkauf, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');} } else { 
   		    if ((~befehl.indexOf("--MARKETING")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}          }
          
       // Vorlage (Gewerk, Name)
          if ((~befehl.indexOf("--GEWERK")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich übergebe an Name. Schreiben Sie --Verkauf, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}
       // -----------------
       // System
       // -----------------
       
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Sprechen Sie mit mir über --Produkte und --Beratung. ').then(() => bot.say(VerkaufsBot+' Weitere Funktionen: --Kontakt, --Newsletter, --Mobil und --Über. ')).then(() => 'verkauf');}          
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich bin Barbara, der Verkaufs-Bot. ').then(() => bot.say(MarketingBot+' Barbara ist eine Person, zu der ich später mehr sagen kann (folgt). ')).then(() => bot.say(VerkaufsBot+' Ich kenne mich mit unseren --Produkten aus und --berate Sie gern. ')).then(() => 'verkauf');}          
       // -----------------
       // Inhalte
       // -----------------
          
          if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Text Produkt. ').then(() => 'verkauf');}          
          if ((~befehl.indexOf("--BERAT")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Text Beratung. ').then(() => 'verkauf');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Text Vorlage 1. ').then(() => 'verkauf');}          

       // -----------------
       // Bot aus
       // -----------------
       
       // Zurück merken
          zuletzt = zuruck;
          
       // Irrläufer
          if (versuch == true) { 
             versuche = 0;
          }
          else { 
             if (botsan == true) {
                versuche++; 
                if (versuche == versuche_max)
                {
                   bot.say(VerkaufsBot+'Suchen Sie meine --Befehle? Oder schalten Sie alle --Bots-aus.'); 
                   versuche = 0;
                }
             }
          }
          
       // Weiterleiten
          return bot.setProp('verkauf', 'gesprochen')
              .then(() => dann);
          
       }
        
    },
   
 // ---------------------------
 // Marketing (Cynthia)
 // ---------------------------
 // - name_klein: marketing
 // - name_kamel: Marketing
 // - name_gross: MARKETING
 // - frau_klein: cynthia
 // - frau_kamel: Cynthia
 // - frau_gross: CYNTHIA
 // - bot_name:   MarketingBot
 // - bot_klein:  marketingbot
 // - bot_kamel:  Marketingbot
 // - bot_gross:  MARKETINGBOT
 // ---------------------------
 
    marketing: {
  	
       receive: (bot, message) => {
          
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim().toUpperCase());
          
       // Nächster Schritt default
          var dann = "marketing";
          
       // Nicht-Befehl-Eingaben mitzählen
          var versuch = false;
          
       // Default-Zurück
          var zuruck = "Marketing";
          
       // Zuletzt Varianten
          var zuletzt_dann =  dann;
          var zuletzt_klein = zuletzt_dann.toLowerCase();
          var zuletzt_gross = zuletzt_dann.toUpperCase();
          var zuletzt_kamel = zuletzt_dann.charAt(0).toUpperCase() + zuletzt_dann.slice(1);
          
       // -----------------
       // Bot-Schalter
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben uns Bots ausgeschaltet. Sie können uns wieder anschalten, indem Sie --Bots-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da sind wir wieder! Schreiben Sie --Empfang, um mit mir zu sprechen - oder dem --Verkauf oder --Marketing!')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("marketing" != "empfang") {
          	 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Marketing? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Marketing? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Marketing? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Marketing") { 
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; }             
          } 
          else {
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'marketing');}             
          }
          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'marketing');}if ((~befehl.indexOf("--MENUAN")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'marketing');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'marketing');}if ((~befehl.indexOf("--MENUAUS")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'marketing');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'marketing');}if ((~befehl.indexOf("--MENU")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'marketing');}if ((~befehl.indexOf("--MENUE")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'marketing');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Wir kennen Ihren Namen noch nicht. ').then(() => 'vorname');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Alle unsere Kontaktwege: [Text:Kontakt,RobogeddonKontakt] ').then(() => bot.say(MarketingBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ')).then(() => 'marketing');}          
          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'marketing');}          
          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'marketing');}          
          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'marketing');}          
       // -----------------
       // Über uns
       // -----------------
          
          if ((~befehl.indexOf("--CHATRAUM")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Der Chatraum ist ein Produkt der Chatbot-Agentur #Robogeddon. ').then(() => bot.say(MarketingBot+' Lassen Sie uns über unsere --Produkte sprechen. Oder wollen Sie eine --Beratung? ')).then(() => 'marketing');}          
       // Produkte
          if ("marketing" != "verkauf") {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Die Produkte lassen Sie sich besser von Barbara erklären. Schreiben Sie --Marketing, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo! Mehr über unsere --Produkte folgt... ')).then(() => 'verkauf');}	       
          }
          else {
          	 
             if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Mehr über unsere --Produkte folgt... ').then(() => 'verkauf');}	       
          }
          
       // -----------------
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--NEWSLETTER")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ja, bestellen Sie unseren Newsletter! ').then(() => 'vorname');}          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Diesen Chat mobil öffnen: [Qr:http://chatraum.herokuapp.com/] ').then(() => bot.say(MarketingBot+' Oder öffnen Sie [Textlink:Chatraum.herokuapp.com,http://chatraum.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'marketing');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'marketing');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'marketing');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'marketing');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'marketing');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich übergebe an Alice. Schreiben Sie --Marketing, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich übergebe an Alice. Schreiben Sie --Marketing, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}          }
          
          if (zuletzt_klein != "verkauf") { 
             if ((~befehl.indexOf("--VERKAUF")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich übergebe an Barbara. Schreiben Sie --Marketing, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich übergebe an Barbara. Schreiben Sie --Marketing, um wieder mit mir zu sprechen. ').then(() => bot.say(VerkaufsBot+' Hallo, ich bin Barbara, der Verkaufs-Bot. Ich möchte Ihnen unsere --Produkte zeigen und Sie --beraten! ')).then(() => 'verkauf');} } else { 
             if ((~befehl.indexOf("--VERKAUF")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}if ((~befehl.indexOf("--BARBARA")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich möchte Ihnen unsere --Produkte und meine --Beratung nahelegen! ').then(() => 'verkauf');}          }
          
          if (zuletzt_klein != "marketing") { 
   		    if ((~befehl.indexOf("--MARKETING")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich übergebe an Cynthia. Schreiben Sie --Marketing, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich übergebe an Cynthia. Schreiben Sie --Marketing, um wieder mit mir zu sprechen. ').then(() => bot.say(MarketingBot+' Hallo, ich bin Cynthia, der Marketing-Bot. Ich möchte Ihnen unser --Facebook empfehlen und möchte Sie bitten, an unserer --Umfrage teilzunehmen! ')).then(() => 'marketing');} } else { 
   		    if ((~befehl.indexOf("--MARKETING")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}if ((~befehl.indexOf("--CYNTHIA")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich möchte Ihnen unser --Facebook empfehlen und habe eine --Umfrage. ').then(() => 'marketing');}          }
          
       // Vorlage (Gewerk, Name)
          if ((~befehl.indexOf("--GEWERK")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich übergebe an Name. Schreiben Sie --Marketing, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}
       // -----------------
       // System
       // -----------------
       
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Sprechen Sie mit mir über --Facebook und --Umfrage. ').then(() => bot.say(MarketingBot+' Weitere Funktionen: --Kontakt, --Newsletter, --Mobil und --Über. ')).then(() => 'marketing');}          
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich bin Cynthia, der Marketing-Bot. ').then(() => bot.say(EmpfangsBot+' Cynthia ist eine Person, zu der ich später mehr sagen kann (folgt). ')).then(() => bot.say(MarketingBot+' Ich mache unser --Facebook und habe eine --Umfrage. ')).then(() => 'marketing');}          
       // -----------------
       // Inhalte
       // -----------------
          
          if ((~befehl.indexOf("--FACEBOOK")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Text Facebook. ').then(() => 'marketing');}          
          if ((~befehl.indexOf("--UMFRAGE")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Text Umfrage. ').then(() => 'marketing');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Text Vorlage 1. ').then(() => 'marketing');}          

       // -----------------
       // Bot aus
       // -----------------
       
       // Zurück merken
          zuletzt = zuruck;
          
       // Irrläufer
          if (versuch == true) { 
             versuche = 0;
          }
          else { 
             if (botsan == true) {
                versuche++; 
                if (versuche == versuche_max)
                {
                   bot.say(MarketingBot+'Suchen Sie meine --Befehle? Oder schalten Sie alle --Bots-aus.'); 
                   versuche = 0;
                }
             }
          }
          
       // Weiterleiten
          return bot.setProp('marketing', 'gesprochen')
              .then(() => dann);
          
       }
        
    },
   
    finish: {
       receive: (bot, message) => {
          return bot.getProp('name')
             .then(() => 'finish');
       }
    }
    
   // --------------
   // GESPRÄCH AUS 
   // -------------- 

   });
   
 // Befehle
    function befehlWort(befehl) {
       
    // Wenn die Nachricht nur ein Wort ist
       var test = befehl.split(" "); 
       if ((!test[1]) || (test[1] == "")) {
          
       // In Befehl umwandeln
          befehl = befehl.replace("--", "");
          befehl = "--"+befehl;
          
       // Satzzeichen entfernen
          befehl = befehl.replace(".", "");
          befehl = befehl.replace("!", "");
          befehl = befehl.replace("?", "");
               
       }
            
       return befehl;
       
    }
    
 // Bots vereinfachen
    function sagenhaft(befehl, dann, bot, text1, text2, text3, text4, text5) {
    // sagenhaft('Strategie', dann, bot,
    //    SefzigBot+'Chatten ist die häufigste digitale Beschäftigung in Deutschland: [Text:Aktuelle Statistiken,RobogeddonChatten] Ein weltweiter --Trend mit erheblichen absehbaren Auswirkungen auf die Benutzeroberflächen des Internets.',
    //    SefzigBot+'Chat-Bots gibt es schon --lange. Sie werden gerade jetzt für das Marketing interessant, weil die meisten Menschen mit Chatten vertraut sind und große Anwendungen wie --Facebook, --Slack u.a. ihre Plattformen für Bots öffnen.',
    //    SefzigBot+'Interessieren Sie sich eher für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren?'
    //  );  
       if  (~befehl.indexOf("--STRATEGIE")) { 
          
          versuch = true; 
          
          if ((text5) && (text5 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2) }).then(function(){
             return bot.say(text3) }).then(function(){
             return bot.say(text4) }).then(function(){
             return bot.say(text5); });
          }
          else if ((text4) && (text4 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2) }).then(function(){
             return bot.say(text3) }).then(function(){
             return bot.say(text4); });
          }
          else if ((text3) && (text3 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2) }).then(function(){
             return bot.say(text3); });
          }
          else if ((text2) && (text2 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2); });
          }
          else if ((text1) && (text1 != "")) {
             bot.say(text1);
          }
          
       }
       
    }
      