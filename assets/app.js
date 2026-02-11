import './bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.scss';
import { Application } from "@hotwired/stimulus";
import PluieController from "./controllers/pluie_controller.js";

const application = Application.start();
application.register("pluie", PluieController);
console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');
