import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../models/car.model';
import { Product } from '../models/product.model';
import { CarService } from '../services/car.service';
import { UtilsService } from '../services/utils.service';

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  value: string;
  level: number;
  amount?: string;
}

/**
 * Node data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface CategoryNode {
  name: string;
  value: string;
  children?: CategoryNode[];
  amount?: string;
}

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  // Static functions
  showSnackBar = this.utilsService.openSnackBar;

  // Information about the Car that was received from URL
  public currentCarIndex: number;
  public currentCar: Car;

  // All nodes that were opened at least once are stored in this array to avoid running duplicate queries
  public nodesExpandedOnce: string[] = [];

  public originalTreeData: CategoryNode[] = [
    {
      name: 'Szűrők',
      value: 'filters',
      children: [{ name: 'Olajszűrő', value: 'filters_oil', children: [{ name: '', value: '' }] }, { name: 'Üzemanyag szűrő', value: 'filters_fuel' }, { name: 'Levegőszűrő', value: 'filters_air' }, { name: 'Pollenszűrő', value: 'filters_cabin' },
      { name: 'Hidraulika szűrő', value: 'filters_hydraulics' }, { name: 'AdBlue szűrő', value: 'filters_adlblue' }, { name: 'LPG szűrő', value: 'filters_lpg' },
      { name: 'Szűrőkészlet', value: 'filters_kit' }],
    },
    {
      name: 'Motor',
      value: 'engine',
      children: [{ name: 'Motorblokk', value: 'engine_block' }, { name: 'Hengerfej', value: 'engine_head' }, { name: 'Szívócsonk,kipufogócsonk', value: 'engine_manifold' },
      { name: 'Szelepfedél', value: 'engine_valvecover' }, { name: 'Motorkenés', value: 'engine_lubrication' }, { name: 'Vezérmű', value: 'engine_timing' },
      { name: 'Szíjhajtás', value: 'engine_belt' }, { name: 'Turbórendszer', value: 'engine_turbo' }, { name: 'Tömítéskészlet', value: 'engine_gasket' },
      { name: 'Motortartó', value: 'engine_mount' }],
    },
    {
      name: 'Futómű',
      value: 'suspension',
      children: [{ name: 'Felfüggesztés', value: 'suspension_suspension' }, { name: 'Lengéscsillapítás', value: 'suspension_shock' }],
    },
    {
      name: 'Gyújtás',
      value: 'ignition',
      children: [{ name: 'Gyújtásmodul', value: 'ignition_module' }, { name: 'Gyújtáselosztó', value: 'ignition_distributor' }, { name: 'Gyújtógyertya', value: 'ignition_spark' },
      { name: 'Egyéb', value: 'ignition_other' }],
    },
    {
      name: 'Meghajtás',
      value: 'drive',
      children: [{ name: 'Erőátvitel', value: 'drive_powertransfer' }, { name: 'Kuplungszerkezet', value: 'drive_clutch' }, { name: 'Egyéb', value: 'drive_other' },
      { name: 'Differenciálmű', value: 'drive_differential' }, { name: 'Manuális sebességváltó', value: 'drive_manual' }, { name: 'Automatikus sebességváltó', value: 'drive_automatic' },
      { name: 'Bolygómű', value: 'drive_planetary' }, { name: 'Sebességváltó védőlemez', value: 'drive_cover' }, { name: 'Hajtótengely', value: 'drive_drivetrain' },
      { name: 'Osztómű', value: 'drive_transfercase' }],
    },
    {
      name: 'Fékrendszer',
      value: 'brake',
      children: [{ name: 'Fékbetét', value: 'brake_pads' }, { name: 'Féktárcsa', value: 'drive_disc' }, { name: 'Féknyereg', value: 'brake_caliper' },
      { name: 'Fékpofa', value: 'brake_shoe' }, { name: 'Fékdob', value: 'brake_drum' }, { name: 'Fékmunkahenger', value: 'brake_cylinder' },
      { name: 'Fékszervó', value: 'brake_servo' }, { name: 'Légfékrendszer', value: 'brake_pneumatics' }, { name: 'Szelepek', value: 'brake_valves' },
      { name: 'Fékbowden', value: 'brake_bowden' }, { name: 'Retarder', value: 'brake_retarder' }, { name: 'Kézifék', value: 'brake_handbrake' }, { name: 'Főfékhenger', value: 'brake_master' },
      { name: 'Fékcső', value: 'brake_pipe' }, { name: 'ABS', value: 'brake_abs' }, { name: 'Fékerőszabályzó', value: 'brake_regulator' }, { name: 'Féklámpakapcsoló', value: 'brake_switch' },
      { name: 'Fék porvédő lemez', value: 'brake_cover' }, { name: 'Fékfolyadék tartály', value: 'brake_tank' }],
    },
    {
      name: 'Kormányzás',
      value: 'steering',
      children: [{ name: 'Kormányösszekötő', value: 'steering_tierod' }, { name: 'Kormánymű', value: 'steering_rack' },
      { name: 'Kormányszervó', value: 'steering_servo' }, { name: 'Kormányoszlop', value: 'steering_rod' }, { name: 'Egyéb', value: 'steering_other' }],
    },
    {
      name: 'Hűtés',
      value: 'cooling',
      children: [{ name: 'Vízpumpa', value: 'cooling_waterpump' }, { name: 'Motorhűtő', value: 'cooling_radiator' }, { name: 'Termosztát', value: 'cooling_thermostat' },
      { name: 'Hűtőventilátor', value: 'cooling_fan' }, { name: 'Kiegyenlítőtartály', value: 'cooling_tank' }, { name: 'Intercooler', value: 'cooling_intercooler' },
      { name: 'Olajhűtő', value: 'cooling_oil' }, { name: 'Hűtőcső', value: 'cooling_pipe' }, { name: 'Egyéb', value: 'cooling_other' }],
    },
    {
      name: 'Elektromos rendszer',
      value: 'electronics',
      children: [{ name: 'Szenzorok', value: 'electronics_sensors' }, { name: 'Tempomat', value: 'electronics_tempomat' }, { name: 'Akkumulátor', value: 'electronics_battery' },
      { name: 'Önindító', value: 'electronics_starter' }, { name: 'Generátor', value: 'electronics_alternator' }, { name: 'Relék', value: 'electronics_relays' },
      { name: 'Kapcsolók', value: 'electronics_controls' }, { name: 'Biztosítékok', value: 'electronics_fuses' }, { name: 'Indító rendszer', value: 'electronics_start' },
      { name: 'Elektromos hajtás', value: 'electronics_drive' }, { name: 'Egyéb', value: 'electronics_other' }],
    },
    {
      name: 'Kipufogórendszer',
      value: 'exhaust',
      children: [{ name: 'Kipufogó dob', value: 'exhaust_muffler' }, { name: 'Csövek', value: 'exhaust_pipe' }, { name: 'Kipufogó tömítés', value: 'exhaust_gasket' },
      { name: 'Tartóelemek', value: 'exhaust_mount' }, { name: 'Szerelési elemek', value: 'exhaust_assembly' }, { name: 'Katalizátor', value: 'exhaust_catalytic' },
      { name: 'Lambdaszonda', value: 'exhaust_sensor' }, { name: 'Részecskeszűrő', value: 'exhaust_filter' }, { name: 'Leömlő', value: 'exhaust_manifold' },
      { name: 'EGR rendszer', value: 'exhaust_egr' }, { name: 'AdBlue rendszer', value: 'exhaust_adblue' }, { name: 'Egyéb', value: 'exhaust_other' }],
    },
    {
      name: 'Szívórendszer',
      value: 'intake',
      children: [{ name: 'Fojtószelep', value: 'intake_throttle' }, { name: 'Csövek', value: 'intake_pipe' }, { name: 'Szívórendszer tömítés', value: 'intake_gasket' },
      { name: 'Légtömegmérő', value: 'intake_sensor' }, { name: 'Egyéb szívórendszer alkatrész', value: 'intake_other' }],
    },
    {
      name: 'Üzemanyagrendszer',
      value: 'fuel',
      children: [{ name: 'Üzemanyagszivattyú', value: 'fuel_pump' }, { name: 'Üzemanyag rendszer tömítés', value: 'fuel_gasket' }, { name: 'Nagynyomású üzemanyag szivattyú', value: 'fuel_highpressure' },
      { name: 'Közös nyomócső', value: 'fuel_rail' }, { name: 'Szelepek', value: 'fuel_valves' }, { name: 'Injektor', value: 'fuel_injector' }, { name: 'Karburátor', value: 'fuel_carburator' },
      { name: 'Üzemanyagtartály', value: 'fuel_tank' }, { name: 'Egyéb üzemanyagrendszer alkatrész', value: 'fuel_other' }],
    },
    {
      name: 'Pneumatikus rendszer',
      value: 'pneumatics',
      children: [{ name: 'Légszárító', value: 'pneumatics_dryer' }, { name: 'Csövek', value: 'pneumatics_pipe' }, { name: 'Légtartály', value: 'pneumatics_tank' },
      { name: 'Kompresszor', value: 'pneumatics_compressor' }, { name: 'Szelepek', value: 'pneumatics_valves' }, { name: 'Egyéb', value: 'pneumatics_other' }],
    },
    {
      name: 'Hidraulikus rendszer',
      value: 'hydraulics',
      children: [{ name: 'Hidraulikus szivattyú', value: 'hydraulics_pump' }, { name: 'Hidraulikacső', value: 'hydraulics_pipe' }, { name: 'Egyéb hidraulikus rendszer alkatrész', value: 'hydraulics_other' }],
    },
    {
      name: 'Világítás',
      value: 'lighting',
      children: [{ name: 'Főfényszóró', value: 'lighting_headlight' }, { name: 'Ködlámpa', value: 'lighting_foglamp' }, { name: 'Hátsó lámpa', value: 'lighting_rear' },
      { name: 'Rendszámtábla-világítás', value: 'lighting_plate' }, { name: 'Tolatólámpa', value: 'lighting_reverse' }, { name: 'Féklámpa', value: 'lighting_brake' },
      { name: 'Irányjelző', value: 'lighting_indicator' }, { name: 'Belső világítás', value: 'lighting_interior' }, { name: 'Munkalámpa', value: 'lighting_work' },
      { name: 'Forgólámpa', value: 'lighting_spinning' }, { name: 'Jelzőfény', value: 'lighting_alert' }, { name: 'Egyéb', value: 'lighting_other' }]
    },
    {
      name: 'Karosszéria',
      value: 'chassis',
      children: [{ name: 'Lökhárító', value: 'chassis_bumper' }, { name: 'Homlokfal', value: 'chassis_front' }, { name: 'Sárvédő', value: 'chassis_fender' },
      { name: 'Motorháztető', value: 'chassis_hood' }, { name: 'Motortér', value: 'chassis_engine' }, { name: 'Oldalsó ajtó', value: 'chassis_sidedoor' },
      { name: 'Hátsó ajtó', value: 'chassis_reardoor' }, { name: 'Embléma és díszcsík', value: 'chassis_emblem' }, { name: 'Tükör', value: 'chassis_mirror' },
      { name: 'Gázteleszkóp', value: 'chassis_spring' }, { name: 'Vezetőfülke felfüggesztés', value: 'chassis_cabin' }, { name: 'Ablak', value: 'chassis_window' },
      { name: 'Kormányzás', value: 'chassis_steering' }, { name: 'Tanksapka', value: 'chassis_fuel' }, { name: 'Javító panel', value: 'chassis_repair' }, { name: 'Egyéb', value: 'chassis_other' }]
    },
    {
      name: 'Ablaktörlő rendszer',
      value: 'window',
      children: [{ name: 'Ablaktörlő', value: 'window_wiper' }, { name: 'Ablakmosó és fényszórómosó', value: 'window_cleaner' }]
    },
    {
      name: 'Klímarendszer',
      value: 'ac',
      children: [{ name: 'Klíma kompresszor', value: 'ac_compressor' }, { name: 'Klímaberendezés', value: 'ac_coolingsystem' }, { name: 'Fűtésrendszer', value: 'ac_heatingsystem' }]
    },
    {
      name: 'Tartozékok',
      value: 'attachment',
      children: [{ name: 'Elektromos tartozékok', value: 'attachment_electronics' }, { name: 'Általános tartozékok', value: 'attachment_general' }]
    },
  ];

  private _transformer = (node: CategoryNode, level: number) => {
    return {
      expandable: (!!node.children && node.children.length > 0) || (node.amount && parseInt(node.amount.replace('(', '').replace(')', '')) > 0),
      name: node.name,
      value: node.value,
      amount: node.amount,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  expandedNodes = new Array<FlatNode>();

  constructor(private utilsService: UtilsService, private router: Router, private route: ActivatedRoute, private carService: CarService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.dataSource.data = this.originalTreeData;
  }

  ngOnInit(): void {
    this.currentCarIndex = parseInt(this.route.snapshot.paramMap.get('index'));
    this.carService.getCurrentCar(this.currentCarIndex).subscribe(data => {
      this.currentCar = data[0];

      this.ignoreEmptyMainCategories();
    });
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  /**
   * This function runs onInit
   * Deletes all main categories that we have no product avaible in
   * If amount of products is greater than 0, put (amount) to end of category name
   */
  ignoreEmptyMainCategories(): void {
    if (!this.currentCar.productLengths) {
      this.originalTreeData = [];
      this.dataSource.data = [];
      return;
    }

    for (let i = 0; i < this.originalTreeData.length; i++) {
      for (let j = 0; j < this.currentCar.productLengths.length; j++) {
        if (this.currentCar.productLengths[j].split('*')[0] == this.originalTreeData[i].value) {
          let amount = parseInt(this.currentCar.productLengths[j].split('*')[1]);

          // If there are no products, remove category
          if (amount <= 0) {
            this.originalTreeData.splice(i, 1);
            j++;
          } else {
            this.originalTreeData[i].amount = '(' + amount + ')';
          }
        }
      }
    }

    this.dataSource.data = this.originalTreeData;
  }

  /**
   * Runs every time a node is clicked
   * If level 0 node was clicked, modifies originalTreeData by removing categories where amount is 0
   * If level 1 node was clicked, creates an additional branch of categories to be appended to dataSource
   * If level 2 of greater is clicked, do nothing
   * 
   * @param node The node that was clicked
   */
  async getProducts(node: FlatNode) {
    if (node.level > 1) {
      return;
    }

    // When a level 0 node is clicked, remove all unnecessary subcategories
    if (node.level == 0) {

      // Loop through pre-saved products lengths
      for (let i = 0; i < this.currentCar.productLengths.length; i++) {
        if (this.currentCar.productLengths[i].split('*')[0].trim() == node.value) {
          for (let j = 0; j < this.originalTreeData.length; j++) {

            // Found a subcategory node that needs to be checked
            if (this.originalTreeData[j].value == node.value) {
              for (let k = 0; k < this.originalTreeData[j].children.length; k++) {

                // If amount is greater than 0, append (amount) text to the end of name
                let numberOfParts = this.currentCarHasValue(this.originalTreeData[j].children[k].value);
                if (numberOfParts > 0) {
                  this.originalTreeData[j].children[k].amount = '(' + numberOfParts + ')';
                  this.originalTreeData[j].children[k].children = [];
                } else {
                  // Any category that we dont have any part of, needs to be removed from the array
                  this.originalTreeData[j].children.splice(k, 1);
                  k--;
                }
              }
            }
          }
        }
      }

      // If a level 1 subcategory was clicked, we need to create an object tree
    } else if (node.level == 1) {

      // Avoid duplicate API calls by storing nodes that were already expanded at least once
      if (this.nodesExpandedOnce.includes(node.value))
        return;
      this.nodesExpandedOnce.push(node.value);

      // Query for every product with current car index, and specific category name
      this.carService.getProducts(this.currentCar.carIndex, node.name).subscribe(data => {

        // Check which originalTree row was clicked
        for (let i = 0; i < this.originalTreeData.length; i++) {
          let result = this.originalTreeData[i].children.findIndex(obj => {
            return obj.name === node.name;
          });

          // If result is not -1, that row was clicked
          if (result != -1) {

            // Initialize variables before building tree
            let obj = { name: node.name, children: [] };
            let parentObject = obj;

            // Loop through all products within category to check their sub-categories
            for (let j = 0; j < data.length; j++) {

              // Loop through all categories within a product except first 2
              for (let k = 2; k < data[j].categories.length; k++) {

                // If not already exists, append category to tree
                if (obj.children.filter(e => e.name == data[j].categories[k]).length <= 0) {
                  obj.children.push({ name: data[j].categories[k], children: [] });
                }

                // Move down pointer within tree by one
                let idx = obj.children.findIndex(e => e.name == data[j].categories[k]);
                obj = obj.children[idx];
              }

              // Save already queried products in sessionStorage to later be used in products component
              this.saveInSessionStorage(data, node);

              // Relocate pointer to top of the tree (upper most parent)
              obj = parentObject;
            }

            parentObject.children.forEach(child => {
              this.originalTreeData[i].children[result].children.push(child);
            });

          }
        }

        // Save expanded nodes, update dataSource, then restore expanded nodes
        this.saveExpandedNodes();
        this.dataSource.data = this.originalTreeData;
        this.restoreExpandedNodes();
      });
    }

    // Save expanded nodes, update dataSource, then restore expanded nodes
    this.saveExpandedNodes();
    this.dataSource.data = this.originalTreeData;
    this.restoreExpandedNodes();

  }

  /**
   * This function saves Products in sessionStorage
   * 
   * @param products The Product[] to be saved
   * @param clickedNode The node that was originally clicked, the node's name will be the access key
   */
  saveInSessionStorage(products: Product[], clickedNode: any): void {
    let newCategories: string[] = [];

    // Loop through Products
    products.forEach(product => {
      let newCategory = product.categories[product.categories.length - 1];
      if (!newCategories.includes(newCategory)) {

        // Add sub-category to array for duplicate checking
        newCategories.push(newCategory);
        sessionStorage.setItem(newCategory, '');
      }

      let sessionStorageData = sessionStorage.getItem(newCategory);
      if (!sessionStorageData)
        sessionStorageData = '';

      sessionStorageData += product.partNumber + '!' + product.name + '!' + product.imgurls[0] + '!' + product.price + '!' + product.brand + '*';
      sessionStorage.setItem(newCategory, sessionStorageData);
    });

  }

  /**
   * Adds the currentCar's carIndex to the users garage[] field
   */
  addToGarage(): void {
    this.carService.addToGarage(parseInt(this.currentCar.carIndex)).then(res => {
      this.showSnackBar('Autó sikeresen a garázshoz adva!', 'Bezárás', 4000);
    });
  }

  /**
   * Checks if currentCar has a specific value in productLengths field
   * If yes, returns the corresponding amount
   * If no, returns 0
   * 
   * @param value The value to look for
   * @returns Number, amount of car parts for a specific category
   */
  currentCarHasValue(value: string): number {
    for (let i = 0; i < this.currentCar.productLengths.length; i++) {
      if (this.currentCar.productLengths[i].split('*')[0] == value) {
        return parseInt(this.currentCar.productLengths[i].split('*')[1]);
      }
    }

    return 0;
  }

  /**
   * Saves all isExpanded values of nodes
   * Used before modifying tree's data to avoid data loss
   */
  saveExpandedNodes() {
    this.expandedNodes = new Array<FlatNode>();
    this.treeControl.dataNodes.forEach(node => {
      if (node.expandable && this.treeControl.isExpanded(node)) {
        this.expandedNodes.push(node);
      }
    });
  }

  /**
   * Restores isExpanded values of nodes
   * Used after modifying tree's data
   */
  restoreExpandedNodes() {
    this.expandedNodes.forEach(node => {
      this.treeControl.expand(this.treeControl.dataNodes.find(n => n.value === node.value));
    });
  }

}
