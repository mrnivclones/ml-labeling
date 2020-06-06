from django.contrib import admin
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from backend_api.core import views
from rest_framework import routers

"""
urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', views.HelloView.as_view(), name='hello'),
    path('issue/', views.IssueList.as_view(), name='issue'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]
"""

router = routers.SimpleRouter()
router.register(r'issue', views.IssueViewSet)
router.register(r'coord', views.CoordViewSet)
router.register(r'report', views.ReportViewSet)
urlpatterns = router.urls

urlpatterns += [
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('admin/', admin.site.urls),
]