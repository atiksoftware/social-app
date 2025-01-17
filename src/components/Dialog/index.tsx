import React, {useImperativeHandle} from 'react'
import {View, Dimensions} from 'react-native'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {useTheme, atoms as a} from '#/alf'
import {Portal} from '#/components/Portal'
import {createInput} from '#/components/forms/TextField'

import {
  DialogOuterProps,
  DialogControlProps,
  DialogInnerProps,
} from '#/components/Dialog/types'
import {Context} from '#/components/Dialog/context'

export {useDialogControl, useDialogContext} from '#/components/Dialog/context'
export * from '#/components/Dialog/types'
// @ts-ignore
export const Input = createInput(BottomSheetTextInput)

export function Outer({
  children,
  control,
  onClose,
  nativeOptions,
}: React.PropsWithChildren<DialogOuterProps>) {
  const t = useTheme()
  const sheet = React.useRef<BottomSheet>(null)
  const sheetOptions = nativeOptions?.sheet || {}
  const hasSnapPoints = !!sheetOptions.snapPoints
  const insets = useSafeAreaInsets()

  const open = React.useCallback<DialogControlProps['open']>((i = 0) => {
    sheet.current?.snapToIndex(i)
  }, [])

  const close = React.useCallback(() => {
    sheet.current?.close()
  }, [])

  useImperativeHandle(
    control.ref,
    () => ({
      open,
      close,
    }),
    [open, close],
  )

  const onChange = React.useCallback(
    (index: number) => {
      if (index === -1) {
        onClose?.()
      }
    },
    [onClose],
  )

  const context = React.useMemo(() => ({close}), [close])

  return (
    <Portal>
      <BottomSheet
        enableDynamicSizing={!hasSnapPoints}
        enablePanDownToClose
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        keyboardBlurBehavior="restore"
        topInset={insets.top}
        {...sheetOptions}
        ref={sheet}
        index={-1}
        backgroundStyle={{backgroundColor: 'transparent'}}
        backdropComponent={props => (
          <BottomSheetBackdrop
            opacity={0.4}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
          />
        )}
        handleIndicatorStyle={{backgroundColor: t.palette.primary_500}}
        handleStyle={{display: 'none'}}
        onChange={onChange}>
        <Context.Provider value={context}>
          <View
            style={[
              a.absolute,
              a.inset_0,
              t.atoms.bg,
              {
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                height: Dimensions.get('window').height * 2,
              },
            ]}
          />
          {children}
        </Context.Provider>
      </BottomSheet>
    </Portal>
  )
}

// TODO a11y props here, or is that handled by the sheet?
export function Inner(props: DialogInnerProps) {
  const insets = useSafeAreaInsets()
  return (
    <BottomSheetView
      style={[
        a.p_lg,
        {
          paddingTop: 40,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingBottom: insets.bottom + a.pb_5xl.paddingBottom,
        },
      ]}>
      {props.children}
    </BottomSheetView>
  )
}

export function ScrollableInner(props: DialogInnerProps) {
  const insets = useSafeAreaInsets()
  return (
    <BottomSheetScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      style={[
        a.flex_1, // main diff is this
        a.p_xl,
        {
          paddingTop: 40,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        },
      ]}>
      {props.children}
      <View style={{height: insets.bottom + a.pt_5xl.paddingTop}} />
    </BottomSheetScrollView>
  )
}

export function Handle() {
  const t = useTheme()
  return (
    <View style={[a.absolute, a.w_full, a.align_center, a.z_10, {height: 40}]}>
      <View
        style={[
          a.rounded_sm,
          {
            top: a.pt_lg.paddingTop,
            width: 35,
            height: 4,
            alignSelf: 'center',
            backgroundColor: t.palette.contrast_900,
            opacity: 0.5,
          },
        ]}
      />
    </View>
  )
}

export function Close() {
  return null
}
