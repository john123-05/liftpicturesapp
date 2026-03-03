# liftpicturesapp

## Start (local)

```bash
npm install
npm run dev
```

## Payments (Stripe + iOS IAP)

- Web/Android Checkout bleibt bei Stripe (`supabase/functions/cart-checkout`).
- iOS Native kann optional auf Apple IAP (RevenueCat) umgestellt werden.
- Es wurden keine Stripe-Backend-Flows ersetzt; die Webapp bleibt unveraendert funktionsfaehig.
- Expo Go nutzt keinen echten IAP-Checkout. Fuer echte Tests brauchst du einen Dev Build oder TestFlight.

### Optional iOS IAP aktivieren

In `.env` setzen:

```bash
EXPO_PUBLIC_IAP_ENABLED=true
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_xxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_IAP_PHOTO_PRODUCT_ID=liftpictures_photo_unlock
```

Hinweis: Aktuell ist der IAP-Flow in dieser App bewusst auf Einzelbild-Kaeufe (`type=photo`) begrenzt. Passes/Tickets laufen weiterhin ueber Stripe-Checkout.

### EAS Environment Variablen (fuer Cloud-Builds)

Setze die gleichen Werte auch in EAS, sonst sind sie im TestFlight-Build nicht enthalten:

```bash
npx eas env:create --environment production --name EXPO_PUBLIC_IAP_ENABLED --value true
npx eas env:create --environment production --name EXPO_PUBLIC_REVENUECAT_IOS_API_KEY --value appl_xxxxxxxxxxxxxxxxxxxxx
npx eas env:create --environment production --name EXPO_PUBLIC_IAP_PHOTO_PRODUCT_ID --value liftpictures_photo_unlock
npx eas env:create --environment production --name EXPO_PUBLIC_WEB_CHECKOUT_RETURN_URL --value https://liftpictures.app
```

### TestFlight Build Command

```bash
npm run testflight
```

Oder ohne npm script:

```bash
npx eas-cli build --platform ios --profile testflight --auto-submit
```

## iOS TestFlight Build

```bash
npm run build:ios
```

## iOS TestFlight Build + Submit

```bash
npm run flighttest
```

## iOS Submit Latest Build

```bash
npm run submit:ios
```
