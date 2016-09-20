import angular from 'angular';
import 'modules/html_templates/html_templates.module';
import 'dpiccone/ng-pageslide';
import 'modules/codemirror/ui.codemirror.module';
import 'modules/mc.resizer/mc.resizer.module';

import VicoControllers from 'modules/controllers/vico-controllers.module';
import VicoServices from 'modules/services/vico-services.module';
import VicoFilters from 'modules/filters/vico-filters.module';

import HomeConfig from './home.config';

export default angular
  .module('Home', [
    'HTMLTemplates',
    'pageslide-directive',
    'ui.codemirror',
    'mc.resizer',
    VicoControllers.name,
    VicoServices.name,
    VicoFilters.name
  ])
  .config(HomeConfig);
