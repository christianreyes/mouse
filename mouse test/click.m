// File:
// click.m
//
// Compile with:
// gcc -o click click.m -framework ApplicationServices -framework Foundation -framework AppKit
//
// Usage:
// ./click -x pixels -y pixels -clicks Number Of Clicks - interval wait between clicks
// At the given coordinates it will click and release.

#import <Foundation/Foundation.h>
#import <ApplicationServices/ApplicationServices.h>

int main(int argc, char *argv[])
{
NSAutoreleasePool *pool    = [[NSAutoreleasePool alloc] init];
NSUserDefaults *args    = [NSUserDefaults standardUserDefaults];

// Wait 5 seconds before getting the mouse location, give
// the user a chance.

// Grabs command line arguments -x, -y, -clicks, -interval.
// If not set, it'll use the current mouse location for coordinates
// and 1 for the click count and interval.
int x        = [args integerForKey:@"x"];
int y        = [args integerForKey:@"y"];
int clicks    =    [args integerForKey:@"clicks"];
int interval=    [args integerForKey:@"interval"];
if (x == 0 || y == 0)
{

CGEventRef ourEvent = CGEventCreate(NULL);
CGPoint ourLoc = CGEventGetLocation(ourEvent);

x = ourLoc.x;
y = ourLoc.y;

}
if (clicks == 0)
{
clicks = 1;
}
if (interval == 0)
{
interval = 1;
}

// The data structure CGPoint represents a point in a two-dimensional
// coordinate system.  Here, X and Y distance from upper left, in pixels.
CGPoint pt;
pt.x    = x;
pt.y    = y;

// This is where the magic happens.  See CGRemoteOperation.h for details.
//
// CGPostMouseEvent( CGPoint        mouseCursorPosition,
//                   boolean_t      updateMouseCursorPosition,
//                   CGButtonCount  buttonCount,
//                   boolean_t      mouseButtonDown, ... )
//
// So, we feed coordinates to CGPostMouseEvent, put the mouse there,
// then click and release.
//
int i = 0;
for (i = 0; i < clicks; i++ )
{
CGPostMouseEvent( pt, 1, 1, 1 );
CGPostMouseEvent( pt, 1, 1, 0 );

}

[pool release];
return 0;
}
