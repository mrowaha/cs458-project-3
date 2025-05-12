/**
 * Use this when we just want basic functionality of a tooltip
 * instead of resorting to Devextreme popover
 */

import {
  ComponentType,
  MouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react'

import { createPortal } from 'react-dom'

type TooltipProps = {
  type: 'dark' | 'light'
}

type Events<K = Element> = {
  onMouseEnter: MouseEventHandler<K>
  onMouseMove: MouseEventHandler<K>
  onMouseLeave: MouseEventHandler<K>
}

export const withTooltip = <T extends object, K = Element>(
  Component: ComponentType<T & Events<K>>,
) => {
  return (props: PropsWithChildren<T & { tooltip: TooltipProps }>) => {
    const [tooltipVisible, setTooltipVisible] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

    const handleMouseEnter = useCallback((e: MouseEvent<K>) => {
      setTooltipVisible(true)
      setTooltipPosition({ top: e.clientY + 10, left: e.clientX })
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent<K>) => {
      setTooltipPosition({ top: e.clientY + 10, left: e.clientX })
    }, [])

    const handleMouseLeave = useCallback(() => {
      setTooltipVisible(false)
    }, [])

    return (
      <>
        {tooltipVisible &&
          createPortal(
            <span
              className={`apqp-tooltip ${props.tooltip.type}`}
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }}
            >
              {props.children}
            </span>,
            document.body,
          )}

        <Component
          {...props}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </>
    )
  }
}
