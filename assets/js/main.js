(function() { 
  function draggableSphere( tree ) {
  var pFields = { container : null, camera  : null,
                  controls  : null, scene   : null, 
                  renderer  : null, ambientLight : null,
                  spotLight : null, three     : null,
                  objects : [] },
  self = this;
  pFields.three = tree;

  var initCamera = function( fields ) {
    pFields.camera = new pFields.three.PerspectiveCamera( fields.fov, fields.aspect, fields.near, fields.far );
    pFields.camera.position.z = fields.zPosition;
  }

  var initControls = function() {
    pFields.controls = new pFields.three.TrackballControls( pFields.camera );
  }

  var getSpotLight = function( color, intensity ) {
    return new pFields.three.SpotLight( color, intensity );
  }

  var configSpotLight = function( spotLight, configs ) {
    spotLight.position.set( configs.x, configs.y, configs.z );
    spotLight.castShadow = configs.castShadow;
  }

  var getScene = function() {
    return new pFields.three.Scene();
  }

  var addSceneProperty = function( property ) {
    pFields.scene.add( property )
  }

  var initScene = function( ) {

    pFields.scene    = getScene();
    addSceneProperty( pFields.spotLight );
    addSceneProperty( pFields.ambientLight );
    addObjectToScene( pFields.objects );
  }

  var initLights = function( configs ) {

    pFields.ambientLight = getAmbientLight( configs.ambientLight.color );
    pFields.spotLight = getSpotLight( configs.spotLight.color, configs.spotLight.intensity );
    configSpotLight( pFields.spotLight, configs.spotLight.positions )
    
  }

  var getAmbientLight = function( lightColor ) {

    return new pFields.three.AmbientLight( lightColor )
  }

  var addObjectToScene = function( objects ) {

     for ( var o in objects ) { 
      addSceneProperty( objects[o] )
    }
  }

  var getRandom = function( min, max ) {

    return Math.floor( Math.random() * ( max - min + 1 ) + min );
  }

  var createObject = function( objectFields, randomFields ) {

      var geometry = new pFields.three.SphereGeometry( 1, 30, 30 );
      var object = new pFields.three.Mesh( geometry, new pFields.three.MeshLambertMaterial( { color : objectFields.color } ) );
      object.scale.x = objectFields.size;
      object.scale.y = objectFields.size;
      object.scale.z = objectFields.size;
      return object;
  }

  var initObjects = function( objectFields, count ) {

    for( var i = 0; i < count; i++ ) {
      var object = createObject( objectFields );
      objectFields.positions.x = objectFields.positions.x + getRandom( objectFields.randomFields.min, objectFields.randomFields.max );
      objectFields.positions.y = objectFields.positions.x + getRandom( objectFields.randomFields.min, objectFields.randomFields.max );
      objectFields.positions.z = objectFields.positions.x + getRandom( objectFields.randomFields.min, objectFields.randomFields.max );
      setObjectPosition( object, objectFields.positions );
      pFields.objects.push( object );
    }
  }

  var setObjectPosition = function( object, positions ) {

      object.position.x = positions.x;
      object.position.y = positions.y;
      object.position.z = positions.z;
      return object;
  }
  var initRenderer = function() {

    pFields.renderer = new pFields.three.WebGLRenderer( { antialias: true } );
    pFields.renderer.setClearColor( 0xf1f1f1 );
    pFields.renderer.setPixelRatio( window.devicePixelRatio );
    pFields.renderer.setSize( window.innerWidth, window.innerHeight );
    pFields.renderer.shadowMap.enabled = true;
    pFields.renderer.shadowMap.type = pFields.three.PCFShadowMap;
  }
  var initDrag = function() {
    var dragControls = new pFields.three.DragControls( pFields.objects, pFields.camera, pFields.renderer.domElement );
    dragControls.addEventListener( 'dragstart', function ( event ) { pFields.controls.enabled = false; } );
    dragControls.addEventListener( 'dragend', function ( event ) { pFields.controls.enabled = true; } );
  }
  render = function() {
    pFields.controls.update();
    pFields.renderer.render( pFields.scene, pFields.camera ); 
  }
  var animate = function() {
    render();
    requestAnimationFrame( animate );
  }
  this.start = function() {
    animate();
  }
  this.init = function( configs ) {
    pFields.container = document.createElement( 'div' );
    document.body.appendChild( pFields.container );
    initCamera( configs.camConfig );
    initControls();
    initLights( configs.lightConfigs );
    initObjects( configs.objectFields, configs.objectFields.count );
    initScene();
    initRenderer();
    initDrag();
    pFields.container.appendChild( pFields.renderer.domElement );
  }
}
var configs = { camConfig    : { fov : 90, aspect : ( window.innerWidth / window.innerHeight ), near : 1, far : 10000, zPosition : 500 },
                lightConfigs : { ambientLight : { color : 0x505050 }, spotLight : { color : 0xf4f4f4, intensity : 1.5, positions : { x : 0, y : 500, z : 2000, castShadow : true } } },
                objectFields : { randomFields : { min : -130, max : 130 }, positions : { x : 1, y : 1, z : 1 }, color : 0x11ef30, size : 50, count : 3 }
              }

var spheres = new draggableSphere( THREE );
    spheres.init( configs );
    spheres.start();
  })();
    