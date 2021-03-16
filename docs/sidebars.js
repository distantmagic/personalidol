module.exports = {
  someSidebar: {
    introduction: [
      'introduction-introduction',
    ],
    architecture: [
      'architecture-class-free',
      'architecture-parallelism',
      'architecture-unidirectional-data-flow',
    ],
    "known-issues": [
      'known-issues-firefox-on-linux',
    ],
    api: [
      {
        "dom-renderer": [
          'dom-renderer-DOMElementView',
          'dom-renderer-DOMUIController',
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
          'personalidol-UserSettings',
        ],
      },
    ],
  },
};
