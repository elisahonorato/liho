from django.shortcuts import render

# Create your views here.
def view_function(request):
    context = {'key': 'value'}
    return render(request, 'template.html', context)
