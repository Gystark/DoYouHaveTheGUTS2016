"""
Models for pss
"""
from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User
from notify.signals import notify


# Based on https://www.isp.state.il.us/docs/6-260.pdf
TYPE_CHOICES = (
    ('HOMICIDE', 'HOMICIDE'),
    ('CRIMINAL SEXUALASSAULT', 'CRIMINAL SEXUALASSAULT'),
    ('ROBBERY', 'ROBBERY'),
    ('BATTERY', 'BATTERY'),
    ('RITUALISM', 'RITUALISM'),
    ('ASSAULT', 'ASSAULT'),
    ('BURGLARY', 'BURGLARY'),
    ('BURGLARY ORTHEFT FROM MOTOR VEHICL', 'BURGLARY ORTHEFT FROM MOTOR VEHICL'),
    ('THEFT', 'THEFT'),
    ('MOTOR VEHICLE THEFT', 'MOTOR VEHICLE THEFT'),
    ('ARSON', 'ARSON'),
    ('DECEPTIVE PRACTICES', 'DECEPTIVE PRACTICES'),
    ('CRIMINAL DAMAGE &TRESPASS TOPROPERTY', 'CRIMINAL DAMAGE &TRESPASS TOPROPERTY'),
    ('DEADLY WEAPONS', 'DEADLY WEAPONS'),
    ('SEX OFFENSES', 'SEX OFFENSES'),
    ('GAMBLING', 'GambGAMBLINGling'),
    ('OFFENSES INVOLVING CHILDREN', 'OFFENSES INVOLVING CHILDREN'),
    ('CANNABIS CONTROL ACT', 'CANNABIS CONTROL ACT'),
    ('METHAMPHETAMINE OFFENSES', 'METHAMPHETAMINE OFFENSES'),
    ('CONTROLLED SUBSTANCE ACT', 'CONTROLLED SUBSTANCE ACT'),
    ('HYPODERMIC SYRINGES & NEEDLES ACT', 'HYPODERMIC SYRINGES & NEEDLES ACT'),
    ('DRUG PARAPHERNALIA ACT', 'DRUG PARAPHERNALIA ACT'),
    ('LIQUOR CONTROLACT VIOLATIONS', 'LIQUOR CONTROLACT VIOLATIONS'),
    ('INTOXICATING COMPOUND', 'INTOXICATING COMPOUND'),
    ('MOTOR VEHICLE OFFENSES', 'MOTOR VEHICLE OFFENSES'),
    ('CRIMINAL ABORTION', 'CRIMINAL ABORTION'),
    ('DISORDERLY CONDUCT', 'DISORDERLY CONDUCT'),
    ('INTERFERENCE WITH PUBLIC OFFICERS', 'INTERFERENCE WITH PUBLIC OFFICERS'),
    ('INTIMIDATION', 'INTIMIDATION'),
    ('KIDNAPPING', 'KIDNAPPING'),
    ('HREAT -TERRORISM', 'HREAT -TERRORISM'),
    ('VIOLATIONOF CRIMINAL REGISTRY LAW', 'VIOLATIONOF CRIMINAL REGISTRY LAW'),
    ('OTHER OFFENSES', 'OTHER OFFENSES')
)


class Station(models.Model):
    """
    Model to hold police station data
    District 26 is headquarters
    """
    district = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=500)
    address = models.CharField(max_length=500, default='')
    latitude = models.DecimalField(max_digits=30, decimal_places=15)
    longitude = models.DecimalField(max_digits=30, decimal_places=15)

    def __str__(self):
        return str(self.district)


class News(models.Model):
    """
     Model to hold data for each individual
     piece of news
     """
    title = models.CharField(max_length=500, default="")
    description = models.TextField(default="")
    body = models.TextField(default="")
    slug = models.SlugField()

    def save(self, *args, **kwargs):
        if self.id is None:
            admin = User.objects.filter(is_superuser=True)[0]
            users = list(User.objects.all().exclude(id=admin.id))
            notify.send(sender=admin, recipient_list=users, actor=admin,
                        verb='New information added', description=self.title, nf_type='success')
        self.slug = slugify(self.title)
        super(News, self).save(*args, **kwargs)

    def __str__(self):
        return self.title
