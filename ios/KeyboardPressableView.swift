import AudioToolbox
import ExpoModulesCore
import UIKit

enum KeyboardPressableType {
    case character
    case backspace
    case faceid
    case clear
    case submit
}

enum SystemSound: SystemSoundID {
    case click = 1104
    case delete = 1155
    case modify = 1156

    func play() {
        AudioServicesPlaySystemSound(self.rawValue)
    }
}

class KeyboardPressableView: ExpoView {
    let generator = UIImpactFeedbackGenerator(style: .rigid)
    let onPressCallback = EventDispatcher()
    public let keyboardInputView: UIInputView

    var disabled = false
    var keyType = KeyboardPressableType.character

    required init(appContext: AppContext? = nil) {
        keyboardInputView = UIInputView(frame: .zero, inputViewStyle: .keyboard)
        super.init(appContext: appContext)
        let tapGesture = UITapGestureRecognizer(
            target: self, action: #selector(handleTap))
        self.addGestureRecognizer(tapGesture)
    }

    @objc
    private func handleTap() {
        if disabled {
            return
        }

        onPressCallback([:])

        // Haptic feedback
        generator.prepare()
        generator.impactOccurred()

        var sound: SystemSound

        switch keyType {
        case .backspace:
            sound = .delete
        case .clear, .faceid, .submit:
            sound = .modify
        case .character:
            sound = .click
        }

        sound.play()
    }
}
