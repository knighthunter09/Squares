///<reference path="d3types.ts" />
import Core = module('Core');
import Tile = module('Tile');

export var TileSize:number = 256;
export var TileExp:number = Math.log(TileSize) / Math.log(2);

export class Map
{
    public coord:Core.Coordinate;
    public center:Core.Point;
    
    constructor(center:Core.Point)
    {
        this.center = center;
    }
    
    public roundCoord():Core.Coordinate
    {
        return this.coord.zoomTo(Math.round(this.coord.zoom));
    }
    
    public resize(size:Core.Point):void
    {
        this.center = new Core.Point(size.x/2, size.y/2);
    }
    
    public coordinatePoint(coord:Core.Coordinate):Core.Point
    {
        var pixel_center = this.coord.zoomBy(TileExp),
            pixel_coord = coord.zoomTo(pixel_center.zoom),
            x = this.center.x - pixel_center.column + pixel_coord.column,
            y = this.center.y - pixel_center.row + pixel_coord.row;
        
        return new Core.Point(x, y);
    }
    
    public pointCoordinate(point:Core.Point):Core.Coordinate
    {
        var round_coord = this.roundCoord(),
            zoom_diff = this.coord.zoom - round_coord.zoom,
            pixel_center = this.coord.zoomBy(TileExp + zoom_diff),
            x = point.x - this.center.x,
            y = point.y - this.center.y,
            pixel_coord = pixel_center.right(x).down(y);
        
        return pixel_coord.zoomTo(this.coord.zoom);
    }
    
    public visible_tiles():Tile.Tile[]
    {
        //
        // find coordinate extents of map, at a rounded zoom level.
        //
        var round_coord = this.roundCoord(),
            tl = this.pointCoordinate(new Core.Point(0, 0)),
            br = this.pointCoordinate(new Core.Point(this.center.x*2, this.center.y*2));
        
        console.log('tl:', tl.toString(), 'br:', br.toString());
        
        tl = tl.zoomTo(round_coord.zoom).container();
        br = br.zoomTo(round_coord.zoom).container();
        
        console.log('tl:', tl.toString(), 'br:', br.toString());
        
        //
        // generate visible tile coords.
        //
        var tiles = [];
        
        for(var i = tl.row; i <= br.row; i++) {
            for(var j = tl.column; j <= br.column; j++) {
                var coord = new Core.Coordinate(i, j, round_coord.zoom);
                tiles.push(new Tile.Tile(coord));
            }
        }
        
        return tiles;
    }
}