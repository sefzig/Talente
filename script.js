
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
   var zuletzt = ''; 
   var bekannt = false;
   var botsan = true;
   var angekommen = false;
   
// Props 
   var prop_emailadresse = false;
   var prop_ansprechpartner = false;
   var prop_telefonnummer = false;
   var prop_hilfegeoffnet = false;
   var prop_hilfeverstanden = false;
   var prop_menuverstanden = false;
   var prop_dialogverstanden = false;
   var prop_kontaktverstanden = false;

// Daten 
   var vorname = "Unbekannter";
   var nachname = "Bewerber";
   var email = "test@talente.de";
   var emailkorrekt = true;

// Standard-Texte
   var hilfetext = 'Folgt: Der allgemeine Hilfe-Text.';
      
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
          var dann = "erklart"; // Onboarding.php // Folgt: ansprechpartner
          
          return bot.setProp('empfangen', 'ja')
          .then(() => bot.say(EmpfangsBot+'Lassen Sie uns zunächst ein paar Fragen durchgehen.'))
          .then(() => bot.say(EmpfangsBot+'Wer ist Ihr Ansprechpartner bei uns? Frau --Urbat, Frau --Ortwerth oder jemand --anderes?'))
          .then(() => dann);
          
       }
       
    },

    abgeschlossen: {
    	
        receive: (bot, message) => {
            
            var hilfe = message.text;
            var hilfe_gross = befehlWort(message.text.trim().toUpperCase());
            var beantwortet = false;
            	
            if (~hilfe_gross.indexOf("--HILFE")) { 
            
               beantwortet = true;
               prop_hilfegeoffnet = true;
               
               return bot.setProp('hilfegeoffnet', 'ja')
               .then(() => bot.say(EmpfangsBot+' '+hilfetext))
               .then(() => bot.say(EmpfangsBot+'Die Befehle der Hilfe sind grad noch gesperrt - nach dieser Einführung funktionieren sie. Einverstanden? Bitte sagen Sie --ja.'))
               .then(() => 'abgeschlossen');
               
            }
            
            if (~hilfe_gross.indexOf("--JA")) { 
            
               beantwortet = true;
               prop_hilfeverstanden = true;
               
               return bot.setProp('hilfeverstanden', 'ja')
               .then(() => bot.say(EmpfangsBot+'Dieser Chat hat ein Menü, in dem Sie alle wichtigen Befehle finden!'))
               .then(() => bot.say(EmpfangsBot+'Ich habe das Menü rechts für Sie geöffnet. [Javascript:menu()] Sie können es öffnen und schließen, indem Sie --Menü sagen. Bitte schauen Sie sich das Menü kurz an und schließen Sie es.'))
               .then(() => 'erklart');
               
            }
            
            if (~hilfe_gross.indexOf("--NEIN")) { 
            
               beantwortet = true;
               return bot.setProp('hilfeverstanden', 'nein')
               .then(() => bot.say(EmpfangsBot+'Kopf hoch, Sie werden es auch ohne die Hilfs-Befehle schaffen :) Denn: '))
               .then(() => bot.say(EmpfangsBot+'Dieser Chat hat ein Menü, in dem Sie alle wichtigen Befehle finden.'))
               .then(() => bot.say(EmpfangsBot+'Ich habe das Menü für Sie geöffnet. [Javascript:menu(an)] Sie können es öffnen und schließen, indem Sie --Menü sagen. Bitte schauen Sie sich das Menü kurz an und schließen Sie es.'))
               .then(() => 'erklart');
               
            }
            
            if (beantwortet == false) { 
            
               return bot.setProp('hilfegeoffnet', 'nein')
                  .then(() => bot.say(EmpfangsBot+'Sie müssen natürlich nicht tun, was ich sage ;) Nur denken Sie bitte im richtigen Moment daran, --Hilfe zu sagen.'))
                  .then(() => bot.say(EmpfangsBot+'Dieser Chat hat ein Menü, in dem Sie alle wichtigen Befehle finden.'))
                  .then(() => bot.say(EmpfangsBot+'Ich habe das Menü für Sie geöffnet. [Javascript:menu(an)] Sie können es öffnen und schließen, indem Sie --Menü sagen. Bitte schauen Sie sich das Menü kurz an und schließen Sie es.'))
                  .then(() => 'erklart');
            
            }
            
        }
        
    },

    erklart: {
    	
        receive: (bot, message) => {
            
            var menu = message.text;
            var menu_gross = befehlWort(message.text.trim().toUpperCase());
            var beantwortet = false;
            
            var einfuhrung1 = 'So, gleich sind Sie an Bord - eines noch: Sie können jederzeit hier im Chat mit Ihrem Ansprechpartner kommunizieren. Sagen Sie den Nachnamen von Frau --'+prop_ansprechpartner+', um sie zu benachrichtigen!';
            var einfuhrung2 = 'Hm, natürlich kann es sein, dass sie gerade im Gespräch ist. Dann warten Sie bitte einfach - oder nehmen Sie auf einem anderen Weg Ihrer Wahl Kontakt auf.';
            var einfuhrung3 = 'Alles --klar?';
            
            if (~menu_gross.indexOf("--MENÜ")) { 
            
               beantwortet = true;
               prop_menuverstanden = true;
               resultat = resultat+' Sie haben das Menü verstanden.';
               
               return bot.setProp('menuverstanden', 'ja')
               .then(() => bot.say(EmpfangsBot+'Klasse, nun kennen Sie das Menü. Sie können es auch mit dem Button rechts oben bedienen. [Javascript:menu(aus)] '))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung1+' '))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung2+' '))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung3+' '))
               .then(() => 'verbunden');
               
            }
            
            else if (~menu_gross.indexOf("--TALENT"))    { var verhindert = 'Mehr über uns erfahren Sie'; }
            else if (~menu_gross.indexOf("--ANSPRECH"))  { var verhindert = 'Ihren Ansprechpartner erreichen Sie'; }
            else if (~menu_gross.indexOf("--KONTAKT"))   { var verhindert = 'Die Kontaktdaten sehen Sie'; }
            else if (~menu_gross.indexOf("--MATERI"))    { var verhindert = 'Ihr Material erhalten Sie'; }
            else if (~menu_gross.indexOf("--STELLENA"))  { var verhindert = 'Ihr Stellenangebot sehen Sie'; }
            else if (~menu_gross.indexOf("--UNTERNEHM")) { var verhindert = 'Die Unternehmens-Informationen sehen Sie'; }
            else if (~menu_gross.indexOf("--UNTERLAG"))  { var verhindert = 'Tipps für Ihre Bewerbungs-Unterlagen erhalten Sie'; }
            else if (~menu_gross.indexOf("--TEST"))      { var verhindert = 'Der Test ist bereit'; }
            else if (~menu_gross.indexOf("--HILFE"))     { var verhindert = 'Die Hilfe ist bereit'; }
            else if (~menu_gross.indexOf("--BOT-AUS"))   { var verhindert = 'Sie können mich ausschalten'; }
            else if (~menu_gross.indexOf("--BOT-AN"))    { var verhindert = 'Sie können mich anschalten'; }
            else if (~menu_gross.indexOf("--MOBIL"))     { var verhindert = 'Mobil geht es weiter'; }
            else                                         { var verhindert = 'Die Befehle stehen zur Verfügung'; }
            
            if (beantwortet == false) { 
            
               return bot.setProp('menuverstanden', 'nein')
               .then(() => bot.say(EmpfangsBot+''+verhindert+', sobald wir diese Einführung abgeschlossen haben. Sie können das Menü auch mit dem Button rechts oben bedienen. Ich habe es erstmal geschlossen. '))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung1+' [Javascript:menu(aus)] '))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung2+' '))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung3+' '))
               .then(() => 'verbunden');
            
            }
            
        }
        
    },

    verbunden: {
    	
        receive: (bot, message) => {
            
            var dialog = message.text;
            var dialog_gross = befehlWort(dialog.trim().toUpperCase());
            var beantwortet = false;
            
            var resultat =      'Resultate (bisher):';
            resultat = resultat+' Ihr Ansprechpartner: Frau '+prop_ansprechpartner+'.';
            resultat = resultat+' Ihre E-Mail-Adresse: '+prop_emailadresse+'.';
            resultat = resultat+' Ihre Telefon-Nummer: '+prop_telefonnummer+'.'; 
            if (prop_hilfeverstanden == true) { resultat = resultat+' Sie haben die Hilfe verstanden.'; }
            if (prop_menuverstanden  == true) { resultat = resultat+' Sie haben das Menü verstanden.'; }
            
            var einfuhrung1 = 'Ich möchte Sie abschließend mit Ihren --Materialien vertraut machen: Hier finden Sie Ihr --Stellenangebot, Infos zum --Unternehmen und Tipps für Ihre Bewerbungs- --Unterlagen.';
            var einfuhrung2 = 'Zudem haben wir einen --Test für Sie, mit dem wir Sie auf das Bewerbungsgespräch vorbereiten möchten. ';
            
            var ap_gross = befehlWort(prop_ansprechpartner.trim().toUpperCase());
            
            if (~dialog_gross.indexOf(''+ap_gross+'')) { 
            
               beantwortet = true;
               prop_dialogverstanden = true;
               resultat = resultat+' Sie haben den Dialog verstanden.';
               
               return bot.setProp('dialogverstanden', 'ja')
               .then(() => bot.say(EmpfangsBot+'Klasse, Sie haben den Dialog verstanden. '+resultat))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung1+' '))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung2+' '))
               .then(() => 'empfang');
               
            }
            
            if (~dialog_gross.indexOf('--KLAR')) { 
            
               beantwortet = true;
               prop_dialogverstanden = true;
               resultat = resultat+' Sie haben den Dialog verstanden.';
               
               return bot.setProp('dialogverstanden', 'ja')
               .then(() => bot.say(EmpfangsBot+'Prima, alles klar! '+resultat))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung1+' '))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung2+' '))
               .then(() => 'empfang');
               
            }
            
            if (beantwortet == false) { 
            
               return bot.setProp('dialogverstanden', 'nein')
               .then(() => bot.say(EmpfangsBot+' Text. '))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung1+' '))
               .then(() => bot.say(EmpfangsBot+' '+einfuhrung2+' '))
               .then(() => 'empfang');
            
            }
            
            angekommen = true;
            
        }
        
    },

    fragen: {
    	
        receive: (bot, message) => {
            
            var frage = befehlWort(message.text.trim().toUpperCase());
            var beantwortet = false;
            
            if (~frage.indexOf("--JA")) { 
            
               beantwortet = true;
               return bot.say(EmpfangsBot+'Antwort auf Ja.')
               .then(() => 'fragen');
               
            }
            
            if ((~frage.indexOf("--BEENDEN")) || (~frage.indexOf("--ABBRECHEN")) || (~frage.indexOf("--FERTIG"))) { 
            
               beantwortet = true;
               return bot.say(EmpfangsBot+'Frage-Test beendet. --Empfang?')
               .then(() => 'empfang');
               
            }
            
            if (beantwortet == false) { 
            
               beantwortet = true;
               return bot.say(EmpfangsBot+'Keine Antwort, nächste Frage.')
               .then(() => 'fragen');
               
            }
            
        }
        
    },
   
    ansprechpartner: {
    	
        receive: (bot, message) => {
            
            var partner = befehlWort(message.text.trim().toUpperCase());
            var beantwortet = false;
            
            if (~partner.indexOf("--URBAT")) { 
            
               beantwortet = true;
               prop_ansprechpartner = "Urbat";
               
               return bot.setProp('ansprechpartner', 'Urbat')
               .then(() => bot.say(EmpfangsBot+'Frau Urbat, prima. Bitte bestätigen Sie mit --ja oder --nein.'))
               .then(() => bot.say(AndreasSefzig+'Nach dieser Bestätigung hat der Bewerber Zugriff auf Frau Urbats Kontaktdaten und andere Informationen in ihrem Namen.'))
               .then(() => 'partner');
               
            }
            
            if (~partner.indexOf("--ORTWERTH")) { 
               
               beantwortet = true;
               prop_ansprechpartner = "Ortwerth";
               
               return bot.setProp('ansprechpartner', 'Ortwerth')
               .then(() => bot.say(EmpfangsBot+'Frau Ortwerth, prima. Bitte bestätigen Sie mit --ja oder --nein.'))
               .then(() => bot.say(AndreasSefzig+'Nach dieser Bestätigung hat der Bewerber Zugriff auf Frau Ortwerths Kontaktdaten und andere Informationen in ihrem Namen.'))
               .then(() => 'partner');
               
            }
            
            if (~partner.indexOf("--ANDERE")) { 
               
               beantwortet = true;
               prop_ansprechpartner = "Andere";
               
               return bot.setProp('ansprechpartner', 'Andere')
               .then(() => bot.say(EmpfangsBot+'Sicher, dass Sie einen anderen Ansprechpartner als Frau --Urbat oder Frau --Ortwerth haben? Bitte bestätigen Sie mit --ja oder --nein.'))
               .then(() => bot.say(AndreasSefzig+'Es könnte sein, dass der Ansprechpartner (noch) nicht im System hinterlegt ist. Daher geht Talente-Bot auf Nummer sicher, lässt aber andere Ansprechpartner zu.'))
               .then(() => 'partner');
               
            }
            
            if (beantwortet == false) { 
               
               prop_ansprechpartner = false;
               
               return bot.setProp('ansprechpartner', partner)
               .then(() => bot.say(EmpfangsBot+'Das habe ich nicht verstanden, könnten Sie das bitte wiederholen?'))
               .then(() => "ansprechpartner");
               
            }
            
        }
        
    },

    partner: {
    	
        receive: (bot, message) => {
            
            var partner = befehlWort(message.text.trim().toUpperCase());
            var beantwortet = false;
            
            if (~partner.indexOf("--JA")) { 
            
               beantwortet = true;
               return bot.say(EmpfangsBot+'Frau '+prop_ansprechpartner+' wurde als Ihr Ansprechpartner gespeichert.')
               .then(() => bot.say(EmpfangsBot+'Wie lautet Ihre E-Mail-Adresse, an die wir uns wenden dürfen?'))
               .then(() => 'emailanfang');
               
            }
            
            if ((~partner.indexOf("--NEIN")) && (prop_ansprechpartner == "Andere")) { 
            
               beantwortet = true;
               return bot.say(EmpfangsBot+'Vermutlich ist Ihr Ansprechpartner Frau --Urbat oder Frau --Ortwerth.')
               .then(() => 'ansprechpartner');
               
            }
            if ((~partner.indexOf("--NEIN")) && (prop_ansprechpartner != "Andere")) { 
            
               beantwortet = true;
               return bot.say(EmpfangsBot+'Nicht Frau '+prop_ansprechpartner+', in Ordnung. Ist Ihr Ansprechpartner Frau --Urbat, Frau --Ortwerth oder jemand --anderes?')
               .then(() => 'ansprechpartner');
               
            }
            
        }
        
    },

    emailanfang: {
    	
        receive: (bot, message) => {
            
            var email = message.text;
            var email_gross = befehlWort(message.text.trim().toUpperCase());
            var beantwortet = false;
            
         // Email validieren
            var emailkorrekt = false;
            if (validateEmail(email)) { emailkorrekt = true; }
         // emailkorrekt = true; // Wenn live auskommentieren, folgt
            
            if (~email_gross.indexOf("--JA")) { 
            
               beantwortet = true;
               return bot.setProp('emailbestatigt', 'ja')
               .then(() => bot.say(EmpfangsBot+'Prima, Ihre E-Mail-Adresse wurde gespeichert.'))
               .then(() => bot.say(EmpfangsBot+'Unter welcher Telefon-Nummer erreichen wir Sie?'))
               .then(() => 'telefonanfang');
               
            }
            
            if (~email_gross.indexOf("--NEIN")) { 
            
               beantwortet = true;
               return bot.setProp('emailbestatigt', 'nein')
               .then(() => bot.say(EmpfangsBot+'Bitte geben Sie Ihre E-Mail-Adresse nochmals ein.'))
               .then(() => 'emailanfang');
               
            }
            
            if (beantwortet == false) { 
            
               email = email.replace("--", "");
               email = email.replace("—", "");
            	   
               if (emailkorrekt == true) {
            	   
            	   prop_emailadresse = email;
            	
                  return bot.setProp('email', email)
                     .then(() => bot.say(EmpfangsBot+'Danke. Ist '+email+' korrekt? Bitte bestätigen Sie mit --ja oder --nein. [Javascript:cookies(email,'+email+')] '))
                     .then(() => 'emailanfang');
               
               }
               else {
            	
                  return bot.setProp('emailversuch', 'ja')
                     .then(() => bot.say(EmpfangsBot+''+email+' ist keine valide E-Mail-Adresse. Bitte geben Sie sie nochmal ein!'))
                     .then(() => bot.say(AndreasSefzig+'Die Validierung der E-Mail-Adresse schützt vor Flüchtigkeitsfehlern. Die Adresse kann zudem später geändert werden.'))
                     .then(() => 'emailanfang');
               
               }
               
            }
            
        }
        
    },

    telefonanfang: {
    	
        receive: (bot, message) => {
            
            var telefon = message.text;
            var telefon_gross = befehlWort(message.text.trim().toUpperCase());
            var beantwortet = false;
            	
            if (~telefon_gross.indexOf("--JA")) { 
            
               beantwortet = true;
               return bot.setProp('telefonbestatigt', 'ja')
               .then(() => bot.say(EmpfangsBot+'Prima, Ihre Telefon-Nummer wurde gespeichert.'))
               .then(() => bot.say(EmpfangsBot+'Wo Sie sich nun vorgestellt haben, ein paar Worte zu mir: Ich bin - wie Sie sicher bemerkt haben - ein Roboter (ein Chat-Roboter, um genau zu sein). Meine Aufgabe ist, Sie bei Ihrer Bewerbung unterstützen!'))
               .then(() => bot.say(EmpfangsBot+'Ganz praktisch: Wenn Sie hier im Chat Hilfe brauchen, sagen Sie einfach --Hilfe. Bitte probieren Sie es einmal aus!'))
               .then(() => 'abgeschlossen');
               
            }
            
            if (~telefon_gross.indexOf("--NEIN")) { 
            
               beantwortet = true;
               return bot.setProp('telefonbestatigt', 'nein')
               .then(() => bot.say(EmpfangsBot+'Bitte geben Sie Ihre Telefon-Nummer nochmals ein.'))
               .then(() => 'telefonanfang');
               
            }
            
            if (beantwortet == false) { 
            
               prop_telefonnummer = telefon;
               return bot.setProp('telefon', telefon)
                  .then(() => bot.say(EmpfangsBot+'Danke. Ist '+telefon+' korrekt? Bitte bestätigen Sie mit --ja oder --nein. [Javascript:cookies(telefon,'+telefon+')] '))
                  .then(() => 'telefonanfang');
            
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
             return bot.say(EmpfangsBot+' Sie haben mich ausgeschaltet. Sie können mich wieder anschalten, indem Sie --Bot-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da bin ich wieder! Schreiben Sie --Hilfe, um mit mir zu sprechen.')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("empfang" != "empfang") {
          	 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Hilfe, um mit mir zu sprechen. ')).then(() => 'empfang');}if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Hilfe, um mit mir zu sprechen. ')).then(() => 'empfang');}             
          }
          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Diesen Chat mobil öffnen: [Qr:http://talente.herokuapp.com/] ').then(() => bot.say(EmpfangsBot+' Oder öffnen Sie [Textlink:Talente.herokuapp.com,http://talente.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'empfang');}          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu(an)] Menü eingeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENÜ-AN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu(an)] Menü eingeschaltet. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu(aus)] Menü ausgeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENÜ-AUS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu(aus)] Menü ausgeschaltet. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}          
       // Stile
          if ((~befehl.indexOf("--TALENTE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(talente)] Stil: Talente. ').then(() => 'empfang');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'empfang');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Alice. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Alice. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf! ').then(() => 'empfang');}          }
          
       // -----------------
       // System
       // -----------------
       
          if ((~befehl.indexOf("--HILFE")) && (botsan == true)) { versuch = true; return bot.say(AndreasSefzig+' In der Hilfs-Funktion werden Nutzern alle wichtigen Befehle angezeigt. Sie hat die selbe Funktion wie das Menü. ').then(() => bot.say(EmpfangsBot+' Funktionen: --Kontakt, --Mobil und --Über. ')).then(() => 'empfang');}          
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich bin der Talente-Bot. Meine Aufgabe ist, Sie in diesem Chat willkommen zu heißen, Ihre --Daten aufzunehmen, Sie mit --Material zu versorgen und Ihnen meine --Hilfe anzubieten. ').then(() => bot.say(EmpfangsBot+' Aber Sie wollen sicher hautpsächlich mit Ihrem --Ansprechpartner sprechen. Schalten Sie mich also gerne ein (--Bot-an) oder aus (--Bot-aus)! ')).then(() => 'empfang');}          
       // -----------------
       // Kontakt
       // -----------------
          
          if (prop_ansprechpartner == "Urbat") {
             
             if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(AndreasSefzig+' Es werden nur die Kontaktdaten des beim Onboarding angegebenen Ansprechpartners angezeigt, in diesem Fall Frau '+prop_ansprechpartner+'. Wurde kein Ansprechpartner gewählt, werden die allgemeinen Kontaktdaten genannt. ').then(() => bot.say(EmpfangsBot+' Möchten Sie mit Frau '+prop_ansprechpartner+' --telefonieren, Ihr eine --E-Mail schreiben oder sie auf --Xing kontaktieren? ')).then(() => 'empfang');}             
             if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Rufen Sie Frau Urbat an: [Telefon:040 822186 315] ').then(() => bot.say(EmpfangsBot+' Sie erreichen sie auch mobil: [Telefon:0151 1891 50 88] ')).then(() => 'empfang');}             
             if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie Frau Urbat eine Mail: [Email:au@4-talents.de] ').then(() => 'empfang');}if ((~befehl.indexOf("--EMAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie Frau Urbat eine Mail: [Email:au@4-talents.de] ').then(() => 'empfang');}if ((~befehl.indexOf("--E-MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie Frau Urbat eine Mail: [Email:au@4-talents.de] ').then(() => 'empfang');}             
             if ((~befehl.indexOf("--XING")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Frau Urbats XING-Profil: [Button:XING-Profil öffnen,http://www.xing.com/profile/Annika_Urbat/] ').then(() => 'empfang');}             
          }
          else if (prop_ansprechpartner == "Ortwerth") {
             
             if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(AndreasSefzig+' Es werden nur die Kontaktdaten des beim Onboarding angegebenen Ansprechpartners angezeigt, in diesem Fall Frau '+prop_ansprechpartner+'. Wurde kein Ansprechpartner gewählt, werden die allgemeinen Kontaktdaten genannt. ').then(() => bot.say(EmpfangsBot+' Möchten Sie mit Frau '+prop_ansprechpartner+' --telefonieren, Ihr eine --E-Mail schreiben oder sie auf --Xing kontaktieren? ')).then(() => 'empfang');}             
             if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Rufen Sie Frau Ortwerth an: [Telefon:040 1234567] ').then(() => bot.say(EmpfangsBot+' Sie erreichen sie auch mobil: [Telefon:0151 1234567] ')).then(() => bot.say(AndreasSefzig+' Es können unterschiedliche Texte für die jeweiligen Berater hinterlegt werden. (Folgt: Individuelle Öffnungszeiten) ')).then(() => bot.say(EmpfangsBot+' Freitags erreichen Sie Frau Urbat nicht telefonisch. Schreiben Sie Ihr doch eine --E-Mail! ')).then(() => 'empfang');}             
             if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie Frau Ortwerth eine Mail: [Email:ko@4-talents.de] ').then(() => 'empfang');}if ((~befehl.indexOf("--EMAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie Frau Ortwerth eine Mail: [Email:ko@4-talents.de] ').then(() => 'empfang');}if ((~befehl.indexOf("--E-MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie Frau Ortwerth eine Mail: [Email:ko@4-talents.de] ').then(() => 'empfang');}             
             if ((~befehl.indexOf("--XING")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Frau Ortwerths XING-Profil: [Button:XING-Profil öffnen,http://www.xing.com/profile/Kerstin_Ortwerth/] ').then(() => 'empfang');}             
          }
          else {
             
             if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(AndreasSefzig+' Da beim Onboarding kein Ansprechpartner gewählt wurde, werden die allgemeinen Kontaktdaten angezeigt. ').then(() => bot.say(EmpfangsBot+' Möchten Sie mit uns --telefonieren, uns eine --E-Mail schreiben oder uns auf --Xing erreichen? ')).then(() => 'empfang');}             
             if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Rufen Sie uns an: [Telefon:040 1234567] ').then(() => 'empfang');}             
             if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie uns eine Mail: [Email:info@4-talents.de] ').then(() => 'empfang');}if ((~befehl.indexOf("--EMAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie uns eine Mail: [Email:info@4-talents.de] ').then(() => 'empfang');}if ((~befehl.indexOf("--E-MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie uns eine Mail: [Email:info@4-talents.de] ').then(() => 'empfang');}             
             if ((~befehl.indexOf("--XING")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Unser XING Unternehmens-Profil: [Button:XING-Seite öffnen,http://www.xing.com/companies/4talentsgmbh] ').then(() => 'empfang');}             
          }
          
       // -----------------
       // Über uns
       // -----------------
          
          if ((~befehl.indexOf("--TALENTE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ein Text über Talente. ').then(() => 'empfang');}          
       // -----------------
       // Material
       // -----------------
          
          if ((~befehl.indexOf("--MATERIAL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Damit Sie alle Informationen an einem Ort haben, finden Sie hier Ihre persönlichen Unterlagen - das --Stellenangebot und Informationen zu dem --Unternehmen, für das Sie sich bewerben. Außerdem haben wir ein paar Tipps für Ihre Bewerbungs- --Unterlagen zusammengestellt. ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--STELLENANGEBOT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Hier das Stellenangebot, auf das Sie sich beworben haben: [Text:Ihr Stellenangebot,TalenteStellenangebotDanielTester,] ').then(() => bot.say(AndreasSefzig+' Diese Demo geht davon aus, dass alle Stellenangebote auf einem Server abgelegt sind, wobei die URL einem (noch zu definierenden) Schema folgt und den Namen des Bewerbers enthält. ')).then(() => 'empfang');}          
          if ((~befehl.indexOf("--UNTERNEHMEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Informationen zu dem Unternehmen, bei dem Sie sich bewerben: [Text:Ihr Arbeitgeber in spe,TalenteUnternehmenDanielTester,] ').then(() => bot.say(AndreasSefzig+' Diese Demo geht davon aus, dass alle Unternehmens-Informationen auf einem Server abgelegt sind, wobei die URL einem (noch zu definierenden) Schema folgt und den Namen des Bewerbers enthält. ')).then(() => 'empfang');}          
          if ((~befehl.indexOf("--UNTERLAGEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Wir haben Tipps für Sie zusammengestellt, die Sie bei Ihren Bewerbungs-Unterlagen beachten möchten. [Text:Tipps für Ihre Unterlagen,TalenteUnterlagen,] Sollten Fragen dazu offen bleiben, sprechen Sie Frau --'+prop_ansprechpartner+' darauf an! ').then(() => bot.say(AndreasSefzig+' Die Tipps sind nicht personalisiert - könnten das aber sein. Nur gilt: Je mehr Personalisierung, desto mehr administrativer Aufwand... ')).then(() => 'empfang');}          
          if ((~befehl.indexOf("--TEST")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Der Beginn eines Fragen-Tests. ').then(() => bot.say(AndreasSefzig+' Hier kann der Bewerber ein paar typische Fragen aus dem Bewerbungs-Gespräch üben. Die Antworten kann der Berater in Slack sehen und den Bewerber bei Bedarf darauf ansprechen. ')).then(() => 'fragen');}if ((~befehl.indexOf("--FRAGEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Der Beginn eines Fragen-Tests. ').then(() => bot.say(AndreasSefzig+' Hier kann der Bewerber ein paar typische Fragen aus dem Bewerbungs-Gespräch üben. Die Antworten kann der Berater in Slack sehen und den Bewerber bei Bedarf darauf ansprechen. ')).then(() => 'fragen');}          
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
             return bot.say(EmpfangsBot+' Sie haben mich ausgeschaltet. Sie können mich wieder anschalten, indem Sie --Bot-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da bin ich wieder! Schreiben Sie --Hilfe, um mit mir zu sprechen.')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("verkauf" != "empfang") {
          	 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Verkauf? Schreiben Sie --Hilfe, um mit mir zu sprechen. ')).then(() => 'empfang');}if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Verkauf? Schreiben Sie --Hilfe, um mit mir zu sprechen. ')).then(() => 'empfang');}             
          }
          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Diesen Chat mobil öffnen: [Qr:http://talente.herokuapp.com/] ').then(() => bot.say(VerkaufsBot+' Oder öffnen Sie [Textlink:Talente.herokuapp.com,http://talente.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'verkauf');}          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu(an)] Menü eingeschaltet. ').then(() => 'verkauf');}if ((~befehl.indexOf("--MENÜ-AN")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu(an)] Menü eingeschaltet. ').then(() => 'verkauf');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu(aus)] Menü ausgeschaltet. ').then(() => 'verkauf');}if ((~befehl.indexOf("--MENÜ-AUS")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu(aus)] Menü ausgeschaltet. ').then(() => 'verkauf');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'verkauf');}          
       // Stile
          if ((~befehl.indexOf("--TALENTE")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:stil(talente)] Stil: Talente. ').then(() => 'verkauf');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'verkauf');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich übergebe an Alice. Schreiben Sie --Verkauf, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(VerkaufsBot+' Ich übergebe an Alice. Schreiben Sie --Verkauf, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf! ').then(() => 'empfang');}          }
          

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
             return bot.say(EmpfangsBot+' Sie haben mich ausgeschaltet. Sie können mich wieder anschalten, indem Sie --Bot-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da bin ich wieder! Schreiben Sie --Hilfe, um mit mir zu sprechen.')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("marketing" != "empfang") {
          	 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Marketing? Schreiben Sie --Hilfe, um mit mir zu sprechen. ')).then(() => 'empfang');}if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Marketing? Schreiben Sie --Hilfe, um mit mir zu sprechen. ')).then(() => 'empfang');}             
          }
          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Diesen Chat mobil öffnen: [Qr:http://talente.herokuapp.com/] ').then(() => bot.say(MarketingBot+' Oder öffnen Sie [Textlink:Talente.herokuapp.com,http://talente.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'marketing');}          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu(an)] Menü eingeschaltet. ').then(() => 'marketing');}if ((~befehl.indexOf("--MENÜ-AN")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu(an)] Menü eingeschaltet. ').then(() => 'marketing');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu(aus)] Menü ausgeschaltet. ').then(() => 'marketing');}if ((~befehl.indexOf("--MENÜ-AUS")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu(aus)] Menü ausgeschaltet. ').then(() => 'marketing');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'marketing');}          
       // Stile
          if ((~befehl.indexOf("--TALENTE")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:stil(talente)] Stil: Talente. ').then(() => 'marketing');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'marketing');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich übergebe an Alice. Schreiben Sie --Marketing, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(MarketingBot+' Ich übergebe an Alice. Schreiben Sie --Marketing, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über --Talente, lassen Sie sich unser --Material zeigen, machen Sie unseren --Test oder nehmen Sie --Kontakt zu Ihrem --Ansprechpartner auf! ').then(() => 'empfang');}          }
          

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
    
 // Email validieren
    function validateEmail(email) {
       
    // First check if any value was actually set
       if (email.length == 0) return false;
       
    // Now validate the email format using Regex
       var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
       
    // Antwort
       return re.test(email);
       
    }
    