from django.db.models import Q, Sum

from rest_framework import filters
from rest_framework import viewsets
from rest_framework.response import Response

from time_tracker.models import TimeReport
from time_tracker.serializers import TimeReportSerializer
from time_tracker.permissions import TimeReportPermission
from time_tracker.filters.time_report_filter import TimeReportFilter
from time_tracker.serializers import TimeReportProfileSerializer
from time_tracker.serializers import TimeReportProjectSerializer


class TimeReportViewSet(viewsets.ModelViewSet):
    queryset = TimeReport.objects.all()
    serializer_class = TimeReportSerializer
    permission_classes = (TimeReportPermission,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = TimeReportFilter

    def get_queryset(self):
        user = self.request.user
        time_report = TimeReport.objects.active_projects(seconds__gt=0).order_by('-date', '-id')

        if user.is_superuser:
            return time_report
        return time_report.filter(Q(profile__user=user) | Q(project__in=user.profile.project_set.all()))

    def get_profiles_reports(self, request):
        """
        Get total profiles hours for given filter
        """
        time_report = TimeReportFilter(request.GET, queryset=TimeReport.objects.total_time_by('profile'))

        serializer = TimeReportProfileSerializer(time_report, many=True)
        return Response(serializer.data)

    def get_projects_reports(self, request):
        """
        Get total projects hours for given filter
        """
        time_report = TimeReportFilter(request.GET, queryset=TimeReport.objects.total_time_by('project'))

        serializer = TimeReportProjectSerializer(time_report, many=True)
        return Response(serializer.data)

    def get_total_hours(self, request):
        """
        Get total hours for given filter
        """
        time_report = TimeReportFilter(request.GET, queryset=TimeReport.objects.active_projects(seconds__gt=0))
        time_report = time_report.qs.aggregate(total_seconds=Sum('seconds'))
        time_report['total_hours'] = TimeReport.sec_to_hours(time_report['total_seconds'])
        return Response(time_report)
