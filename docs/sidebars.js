module.exports = {
  someSidebar: {
    introduction: [
      'introduction-introduction',
    ],
    architecture: [
      'architecture-class-free',
      'architecture-unidirectional-data-flow',
      'architecture-handling-dom',
      'architecture-parallelism',
      'architecture-quake-bsp-maps',
    ],
    "known-issues": [
      'known-issues-firefox-on-linux',
    ],
    api: [
      {
        "dom-renderer": [
          'dom-renderer-domElementsLookup',
          'dom-renderer-DOMElementsLookup.type',
          'dom-renderer-DOMElementView',
          'dom-renderer-DOMUIController',
          'dom-renderer-MessageDOMUIDispose.type',
          'dom-renderer-MessageDOMUIRender.type',
          'dom-renderer-RendererDimensionsManager',
        ],
        framework: [
          'framework-DimensionsState',
          'framework-HTMLElementResizeObserver',
          'framework-KeyboardObserver',
          'framework-KeyboardState',
          'framework-MainLoop',
          'framework-MainLoopUpdatable.interface',
          'framework-Mountable.interface',
          'framework-MouseState',
          'framework-Pauseable.interface',
          'framework-TickTImerState.type',
          'framework-TouchState',
          'framework-UserSettings',
          'framework-WindowResizeObserver',
        ],
        personalidol: [
          'personalidol-CameraController',
          'personalidol-CameraControllerState.type',
          'personalidol-MapScene',
          'personalidol-UIStateController',
          'personalidol-UserSettings',
        ],
        quakemaps: [
          'quakemaps-buildGeometryAttributes',
          'quakemaps-EntitySketch.type',
          'quakemaps-UnmarshalException',
          'quakemaps-unmarshalMap',
        ],
      },
    ],
  },
};
