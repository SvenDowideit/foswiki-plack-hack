#!/opt/local/bin/perl
use strict;
use warnings;

our($cfg, $cwd);
use Cwd qw(realpath);
use File::Basename;

BEGIN {
    ###################################
    # Config
    $cfg = {
        config_user => "admin",          #auth-name for the config script (this is not use Foswiki::cfg)
        config_pass => "change-this",    #clear-text password - the simpliest way ;( - need better handling here...
        config_hosts => ['+ 127.0.0.1'], #hosts, allowed access the configure script
        fwdir => "foswiki",        #name of the foswiki subdirectory. Must be in the dir, where is this script.

        #$ENV{PATH} - MUST BE without writable dirs, or configure will complain (-T)
        #env_path => "/opt/local/bin:/usr/bin:/bin:/usr/local/bin",
        env_path => 'c:/windows/system32;c:/windows'
        
    };
    ###################################

    $cwd = dirname( realpath(__FILE__) );

    require "$cwd/$cfg->{fwdir}/bin/setlib.cfg";
    $Foswiki::cfg{Engine} = 'Foswiki::Engine::CGI'; #ESSENTIAL - need to tell foswiki than we not running Engine::Legacy.
}

use Plack::Builder;
use CGI::Emulate::PSGI;
use Plack::App::WrapCGI;
$ENV{PATH} = $cfg->{env_path};

#configure script: standard (forked) CGI application
my $configure = Plack::App::WrapCGI->new( script => "$cwd/$cfg->{fwdir}/bin/configure", execute => 1)->to_app;

#foswiki application - PSGI, with emulated CGI environment
my $foswiki = CGI::Emulate::PSGI->handler(sub {
    use CGI;
    use CGI::Cookie;
    use utf8;
    use Encode;
    #use uni::perl;
    CGI::initialize_globals();
    use CGI::Carp qw(fatalsToBrowser);
    $SIG{__DIE__} = \&CGI::Carp::confess;

    use Foswiki     ();
    use Foswiki::UI ();
    $Foswiki::engine->run();
});

builder {
    enable "Runtime";
    enable "Plack::Middleware::Static", path => qr{^/pub/}, root => "$cwd/$cfg->{fwdir}";

    my @actions = qw(view edit save rest oops
                    attach changes compare login logon manage preview rdiff rdiffauth
                    register rename resetpasswd search statistics upload viewauth viewfile);
    foreach my $act (@actions) {
        mount "/bin/$act" => $foswiki;
    }

    mount "/bin/configure" => builder {
        enable "Auth::Basic", authenticator => \&authen_cb;
        enable 'IPAddressFilter', rules => $cfg->{config_hosts};
        $ENV{AUTH_TYPE} = "BASIC";
        $configure;
    };
};
sub authen_cb {
    my($username, $password) = @_;
    return $username eq $cfg->{config_user} && $password eq $cfg->{config_pass};
}
