import { WebglLine, WebglThickLine, WebglPlot, ColorRGBA } from 'webgl-plot';
export declare type WebglLineProps = {
    values?: number[];
    color?: [number, number, number, number] | ColorRGBA;
    position?: number;
    autoscale?: boolean;
    centerZero?: boolean;
    xAxis: boolean;
    xColor?: [number, number, number, number] | ColorRGBA;
    width?: number;
    [key: string]: any;
} & ({
    nPoints: number;
} | {
    nSec: number;
    sps: number;
});
export declare type WebglLinePlotProps = {
    canvas: HTMLCanvasElement;
    webglOptions?: {
        antialias?: boolean;
        transparent?: boolean;
        desynchronized?: boolean;
        powerPerformance?: 'default' | 'high-performance' | 'low-power';
        preserveDrawing?: boolean;
        debug?: boolean;
    };
    overlay?: HTMLCanvasElement | boolean;
    lines: {
        [key: string]: WebglLineProps;
    };
    interpolate?: boolean;
    dividerColor?: [number, number, number, number] | ColorRGBA;
    [key: string]: any;
};
export declare type WebglLinePlotInfo = {
    plot: WebglPlot;
    settings: WebglLinePlotProps & {
        overlayCtx?: CanvasRenderingContext2D;
    };
};
export declare class WebGLLinePlotUtil {
    plots: {
        [key: string]: WebglLinePlotInfo;
    };
    initPlot(settings: WebglLinePlotProps, plot?: WebglPlot): any;
    deinitPlot(info: WebglLinePlotInfo): boolean;
    update(plotInfo: WebglLinePlotInfo | string, lines?: {
        [key: string]: {
            values: number[];
        };
    }, draw?: boolean): void;
    updateLine(line: WebglLine | WebglThickLine, values: number[], interpolate?: boolean, autoscale?: boolean, autoscalePosition?: number, nLines?: number, centerZero?: boolean): boolean;
    static autoscale(array: any, lineIdx?: number, nLines?: number, centerZero?: boolean): any;
    static absmax(array: any): number;
    static downsample(array: any, fitCount: any, scalar?: number): any;
    static upsample(array: any, fitCount: any, scalar?: number): any[];
    static HSLToRGB(h: any, s: any, l: any): [number, number, number];
    static circularBuffer(arr: any[], newEntries: any[]): any[];
}
