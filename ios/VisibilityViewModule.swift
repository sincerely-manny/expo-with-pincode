import ExpoModulesCore

public class VisibilityViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("VisibilityView")

    View(VisibilityView.self) {
      Events(
        "onBecameVisible",
        "onBecameHidden"
      )
    }
  }
}
