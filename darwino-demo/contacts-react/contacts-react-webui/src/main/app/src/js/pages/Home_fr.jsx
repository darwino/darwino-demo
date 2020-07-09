/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";

export default class Home_fr extends Component {
    render() {
        return (
          <Jumbotron>
            <h1>Contacts Darwino</h1>
            <p>
                Bienvenue dans l'application de demo 'Contacts'
                Cette application est connectee a une application Notes/Domino et replique
                les donnees depuis le serveur Domino vers la base de donnees JSON de Darwino.
                Les memes composants UI peuvent aussi etre utilises pour se connecter directement
                au server Domino.
            </p>
            <p>
                Cette application de demo montre comment creer une interface utilisateur similaire
                aux applications Notes/Domino existante, en utilisant la technologies ReactJS.<br/>
                Voici le liste des composants disponibles:
            </p>
            <ul>
              <li>Une interface utilisateur 'responsive' -> redimentionnez votre browser pour en avoir la demonstration</li>
              <li>Vues: dcument reponses, categorisation, tri dynamique, champs calcules...</li>
              <li>Formulaire: tous les types standard, liste/dialogue de choix, sous formulaire, sections, vues incluses...</li>
              <li>Navigation: choix de la page courante, section fermable...</li>
              <li>Et bien plus encore!</li>
            </ul>
            <p>
                Tout le code est entierement realise avec ReactJS, sans code cache ni technology proprietaire
                a apprendre. Vous pouvez aussi integrer n'importe quelle librarie tierce (Boostrap, 
                MS UI Office Fabric, Material Design - ou autre)

            </p>
            <p>
              <div>
                <a className="btn btn-default" target="_blank" rel="noopener noreferrer" href="https://github.com/darwino/darwino-demo/tree/develop/darwino-demo/contacts-react/contacts-react-webui/src/main/app/js/pages">
                  Voir le code source...
                </a>
              </div>
              <div>
                <a className="btn btn-default" target="_blank" rel="noopener noreferrer" href="https://github.com/darwino/darwino-demo/blob/develop/darwino-demo/contacts-react/contacts-react-shared/src/main/java/com/contacts/app/microservices/SetCompanySize.java">
                  Un example de micro-services qui met la base de donnees a jour...
                </a>
              </div>
            </p>
          </Jumbotron>
        );
  }
}