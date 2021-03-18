module.exports = {
  sidebar: {
    introduction: [
      'introduction-introduction',
    ],
    architecture: [
      'architecture-typescript-only',
      'architecture-class-free',
      'architecture-unidirectional-data-flow',
      'architecture-handling-dom',
      'architecture-parallelism',
      'architecture-quake-bsp-maps',
    ],
    development: [
      'development-building-the-project',
    ],
    "known-issues": [
      'known-issues-firefox-on-linux',
    ],
    api: [
      {
        "dom-renderer": [
          'dom-renderer-intro',
          'dom-renderer-domElementsLookup',
          'dom-renderer-DOMElementsLookup.type',
          'dom-renderer-DOMElementView',
          'dom-renderer-DOMUIController',
          'dom-renderer-MessageDOMUIDispose.type',
          'dom-renderer-MessageDOMUIRender.type',
          'dom-renderer-RendererDimensionsManager',
        ],
        framework: [
          'framework-intro',
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
          'personalidol-intro',
          'personalidol-CameraController',
          'personalidol-CameraControllerState.type',
          'personalidol-MapScene',
          'personalidol-UIStateController',
          'personalidol-UserSettings',
        ],
        quakemaps: [
          'quakemaps-intro',
          'quakemaps-buildGeometryAttributes',
          'quakemaps-EntitySketch.type',
          'quakemaps-UnmarshalException',
          'quakemaps-unmarshalMap',
        ],
      },
    ],
  },
};
