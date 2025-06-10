# Intercom Integration Test App

**Bug Report**: Intercom widget fails to load conversations when transitioning from anonymous to logged-in user.

## 🔬 How to Reproduce the Issue

1. **Setup**: Enter your Intercom App ID
2. **Initial State**: App boots anonymously (✅ working)
3. **Login Transition**: Enter email and click "Login with Email"
4. **Test the Bug**:
   - Open Intercom widget (should show "Hello {name}" + conversation preview)
   - Click on a conversation
   - **Expected**: Conversation loads
   - **Actual**: Conversation fails to load (missing API call)

## 🛠 Technical Implementation

This app uses **only** Intercom's official installation method:

- Direct script loading from `https://widget.intercom.io/widget/{app_id}`
- Official `window.Intercom()` API calls
- Exact `boot()` and `shutdown()` sequence as documented

**No third-party libraries involved.**

The code includes 3 different approaches as suggested by Intercom support:

- **Option 1**: `shutdown()` + `boot()` (currently active)
- **Option 2**: `update()` + delayed `shutdown()` + `boot()` (commented)
- **Option 3**: `shutdown()` + `boot()` + delayed `update()` (commented)

## 🚀 Installation & Usage

```bash
# Clone and install
git clone [your-repo-url]
cd intercom-test-app
npm install

# Run locally
npm start
```

## 📊 Expected vs Actual Behavior

### ✅ Working Scenario (Direct Login)

```
1. Boot with email → Click widget → POST /conversations →
2. Shows "Hello {user}" + messages → Click conversation →
3. POST /conversations/{id} → Full chat loads
```

### ❌ Broken Scenario (Anonymous → Login)

```
1. Boot anonymous → Shutdown → Boot with email → Click widget →
2. POST /conversations → Shows "Hello {user}" + messages → Click conversation →
3. NO POST /conversations/{id} call → Chat fails to load
```

**Status**: Bug persists across all 3 implementation approaches suggested by Intercom support.
