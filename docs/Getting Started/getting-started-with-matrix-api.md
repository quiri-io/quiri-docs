# Getting Started With the Matrix API

After some exploration of Android development (specifically jetpack compose), I finally took a proper swing at Flutter and while jetpack compose seems like a powerful tool and I would love to get to know kotlin better, the cross-platform development and cross-platform design was just too alluring. 

I figured I would start with a login screen as it would get me interacting with state and making an API call. I found some widget online that gave me most of the UI, leaving me to figure out constructing the login API request from the form inputs. 

At first I was wary of using an SDK that was not created by the Matrix team but the Famedly folks are actively contributing to it. So the first thing was [adding the SDK](https://gitlab.com/famedly/company/frontend/famedlysdk) as a dependency.

It is also important for me to start getting to know the matrix API in general so I found their [API reference](https://matrix.org/docs/api/#overview).