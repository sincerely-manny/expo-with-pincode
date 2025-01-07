import ExpoModulesCore

public class KeyboardPressableModule: Module {
    public func definition() -> ModuleDefinition {
        Name("KeyboardPressable")

        View(KeyboardPressableView.self) {
            Events("onPressCallback")
            Prop("disabled") { (view: KeyboardPressableView, value: Bool) in
                view.disabled = value
            }
            Prop("keyType") { (view: KeyboardPressableView, value: String) in
                switch value {
                case "faceid": view.keyType = .faceid
                case "backspace": view.keyType = .backspace
                case "clear": view.keyType = .clear
                case "submit": view.keyType = .submit
                default: view.keyType = .character
                }
            }
        }
    }
}
