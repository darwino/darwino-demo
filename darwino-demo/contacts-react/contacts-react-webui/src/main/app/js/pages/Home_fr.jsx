/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";
import {  _t } from '@darwino/darwino';

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
                <a className="btn btn-default" target="_blank" href="https://github.com/darwino/darwino-demo/tree/develop/darwino-demo/contacts-react/contacts-react-webui/src/main/app/js/pages">
                  Voir le code source...
                </a>
              </div>
              <div>
                <a className="btn btn-default" target="_blank" href="https://github.com/darwino/darwino-demo/blob/develop/darwino-demo/contacts-react/contacts-react-shared/src/main/java/com/contacts/app/microservices/SetCompanySize.java">
                  Un example de micro-services qui met la base de donnees a jour...
                </a>
              </div>
            </p>
          </Jumbotron>
        );
  }
}