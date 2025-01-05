import ExpoModulesCore

public class ExpoWithPincodeModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoWithPincode")

        View(VisibilityView.self) {
            Events(
                "onBecameVisible",
                "onBecameHidden"
            )
        }
    }
}
