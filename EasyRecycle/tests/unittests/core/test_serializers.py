from django.test import TestCase

from core.administration.serializers import BanningUserSerializer


class BanningUserSerializerTestCase(TestCase):

    def test_ban_True(self):
        s = BanningUserSerializer()
        self.assertTrue(s._ban)
